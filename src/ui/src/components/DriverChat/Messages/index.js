import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSession, useApi, useWebsocket, useConfig, useLanguage, useUtils } from '@components'
export const Messages = (props) => {
  const {
    UIComponent,
    authorId,
    driverId,
    authorName,
    customHandleSend,
    messages: orderMessages,
    setMessages: setOrderMessages,
    asDashboard,
    order,
    handleUpdateOrderForUnreadCount,
    showCityChat
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [configState] = useConfig()
  const [{ getOrderState, parsePrice }] = useUtils()
  const [{ user, token }] = useSession()
  const accessToken = props.accessToken || token
  const websocketRef = useRef(null);
  const [canRead, setCanRead] = useState({ business: true, administrator: true, driver: true, customer: true })
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState({ loading: true, error: null, messages: [] })
  const [sendMessage, setSendMessages] = useState({ loading: false, error: null })
  const [readMessages, setReadMessages] = useState({ loading: true, error: null, messages: [] })
  const [image, setImage] = useState(null)
  const socket = useWebsocket()

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
  const getStaticMapByLocation = (location, size) => {
    if (!size) {
      size = '250x100'
    }
    const url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + location.lat + ',' + location.lng + '&zoom=14&size=' + size + '&markers=color:red%7C' + location.lat + ',' + location.lng + '&key=' + googleMapsApiKey
    return url
  }

  const getLogisticTagStatus = (status) => {
    switch (status) {
      case 0:
        return t('PENDING', 'Pending')
      case 1:
        return t('IN_PROGRESS', 'In Progress')
      case 2:
        return t('IN_QUEUE', 'In Queue')
      case 3:
        return t('EXPIRED', 'Logistic expired')
      case 4:
        return t('RESOLVED', 'Resolved')
      default:
        return status
    }
  }

  const getVehicleSmmary = (vehicle) => {
    return vehicle?.type + ' ' + vehicle?.model + ' ' + vehicle?.car_registration + ' ' + vehicle?.color
  }

  const getHistoryComment = (message) => {
    let comment = ''
    const changeAttribute = message?.change?.attribute
    if (changeAttribute === 'distance') {
      comment = t('THE_DRIVER_IS_CLOSE', 'The driver is close') + ' <b>(' + message.driver.name + (message.driver.lastname ? ' ' + message.driver.lastname : '') + ')</b>'
    } else if (changeAttribute === 'status') {
      if (message.change.new === 8 && message.change.estimated) {
        const estimatedDelivery = message.change.estimated
        comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
          .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase()).toLowerCase() + '</b>')
          .replace('_from_', '<b>' + getOrderState(message.change.old * 1) + '</b>')
          .replace('_to_', '<b>' + getOrderState(message.change.new * 1) + '</b>') + '<br>' + t('ESTIMATED_DELIVERY_TIME', 'Estimated delivery time is _min_ min(s).')
          .replace('_min_', estimatedDelivery)
      } else if (message.change.new === 7 && message.change.estimated) {
        const estimatedPreparation = message.change.estimated
        comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
          .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase()).toLowerCase() + '</b>')
          .replace('_from_', '<b>' + getOrderState(message.change.old * 1) + '</b>')
          .replace('_to_', '<b>' + getOrderState(message.change.new * 1) + '</b>') + '<br>' + t('ESTIMATED_PREPARATION_TIME', 'The estimated preparation time is _min_ min(s).')
          .replace('_min_', estimatedPreparation)
      } else {
        comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
          .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase()).toLowerCase() + '</b>')
          .replace('_from_', '<b>' + getOrderState(message.change.old * 1) + '</b>')
          .replace('_to_', '<b>' + getOrderState(message.change.new * 1) + '</b>')
      }
      if (message?.change?.comment) {
        comment += '<br>' + '<b>' + t('COMMENT', '') + '</b>: ' + message.change.comment + '.'
      }
    } else if (changeAttribute === 'driver_id') {
      if (message.driver) {
        comment = t('DRIVER_ASSIGNED_AS_DRIVER', '_driver_ was assigned as driver.')
          .replace('_driver_', '<b>' + message.driver.name + ' ' + (message.driver.lastname ? message.driver.lastname : '') + '</b>')
      } else {
        comment = t('DRIVER_UNASSIGNED', 'The driver was unnasigned')
      }
    } else if (['prepared_in', 'delivered_in', 'delivery_datetime'].includes(changeAttribute)) {
      comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
        .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase(), changeAttribute.replaceAll('_', ' ')).toLowerCase() + '</b>')
        .replace('_from_', '<b>' + (message.change.old || 0) + '</b>')
        .replace('_to_', '<b>' + message.change.new + '</b>')
    } else if (changeAttribute === 'logistic_status') {
      comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
        .replace('_attribute_', '<b>' + t('LOGISTIC_STATUS', 'logistic status') + '</b>')
        .replace('_from_', '<b>' + getLogisticTagStatus(parseInt(message.change.old, 10)) + '</b>')
        .replace('_to_', '<b>' + getLogisticTagStatus(parseInt(message.change.new, 10)) + '</b>')
    } else if (changeAttribute === 'vehicle') {
      comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
        .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase(), changeAttribute.replaceAll('_', ' ')).toLowerCase() + '</b>')
        .replace('_from_', '<b>' + getVehicleSmmary(message.change.old) + '</b>')
        .replace('_to_', '<b>' + getVehicleSmmary(message.change.new) + '</b>')
    } else if (changeAttribute === 'reject_reason') {
      comment = t('ORDER_REJECT_REASON_IS', 'Order <b>reject reason</b> is _reject_reason_.')
        .replace('_reject_reason_', '<b>' + t(`REJECT_REASON_${message.change.new.toUpperCase()}`, ('REJECT_REASON_' + message.change.new).toLowerCase().replaceAll('_', ' ')) + '</b>')
    } else if (changeAttribute === 'summary.refunded') {
      comment = t('REFUNDED', 'Refunded') + '<strong>' + parsePrice(message.change?.new) + '</strong>'
    } else if (changeAttribute !== 'comment' && changeAttribute) {
      if (message.change.old) {
        comment = t('ORDER_ATTRIBUTE_CHANGED_FROM_TO', 'Order _attribute_ changed from _from_ to _to_.')
          .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase(), changeAttribute.replaceAll('_', ' ')).toLowerCase() + '</b>')
          .replace('_from_', '<b>' + message.change.old + '</b>')
          .replace('_to_', '<b>' + message.change.new + '</b>')
      } else {
        comment = t('ORDER_ATTRIBUTE_CHANGED_TO', 'Order _attribute_ changed to _to_.')
          .replace('_attribute_', '<b>' + t(changeAttribute.toUpperCase()).toLowerCase() + '</b>')
          .replace('_to_', '<b>' + message.change.new + '</b>')
      }
    }
    if (['status', 'reject_reason', 'driver_id'].includes(changeAttribute)) {
      if (user.level === 0 || user.level === 2) {
        comment += '<br>-'
        if (message.app_id) comment += '<br><strong>' + t('APP_ID', 'App ID') + ':</strong> ' + message.app_id
        comment += '<br><strong>' + t('AUTHOR', 'Author') + ':</strong> ' + ((message.author) ? (message.author.name + (message.author.lastname ? ' ' + message.author.lastname : '')) : t('GUEST_USER'))
        if (message.user_agent) comment += '<br><strong>' + t('USER_AGENT', 'User agent') + ':</strong> ' + message.user_agent
        if (message.location) comment += '<br><strong>' + t('LOCATION', 'Location') + ':</strong> <img src="' + getStaticMapByLocation(message.location, '250x100') + '" />'
        comment += '<br><strong>' + t('IP', 'IP') + ':</strong> ' + message.ip
      }
    }
    return comment
  }

  /**
   * Method to send message
   */
  const handleSend = async () => {
    if (customHandleSend) {
      return customHandleSend(message)
    }
    try {
      setSendMessages({ loading: true, error: null })
      let driverIds = []
      let userName = user?.name + ' ' + user?.lastname
      let groupName = ''
      if (order.groupchat) {
        groupName = order?.groupname
      }

      console.log('authorId=>' + authorId)
      console.log('userid=>' + driverId)

      const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/global_chat.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          function: 'sendAuthorToDriver',
          authorid: authorId,
          userid: driverId,
          comment: message,
          type: image ? 3 : 2,
          source: image || '',
          author_name: authorName,
          user_name: userName,
          driverids: driverIds,
          groupname: groupName,
          sender_type: 1
        })
      })
      const resultData = await res.json()
      if (!resultData?.error) {
        if (setOrderMessages && orderMessages) {
          setOrderMessages({
            ...orderMessages,
            messages: [
              ...orderMessages.messages,
              resultData?.result
            ]
          })
        } else {
          setMessages({
            ...messages,
            messages: [
              ...messages.messages,
              resultData?.result
            ]
          })
        }
      }
      setSendMessages({ loading: false, error: resultData?.error ? resultData?.result : null })
    } catch (error) {
      setSendMessages({ loading: false, error: [error.Messages] })
    }
  }

  /**
   * Method to Load message for first time
   */
  const loadMessages = async () => {
    try {
      setMessages({ ...messages, messages: [], loading: true })
      console.log('authorId=>' + authorId)
      console.log('driverId=>' + driverId)
      const res = await fetch('https://plugins-development.ordering.co/'+ ordering.project +'/global_chat.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          function: driverId === 1 ? 'getAuthorChatData' : 'getDispatchChatData',
          authorid: authorId,
          userid: driverId
        })
      })
      const resultData = await res.json()
      if (!resultData?.error) {
        setMessages({
          messages: resultData?.result,
          loading: false,
          error: null
        })
      } else {
        setMessages({
          ...messages,
          loading: false,
          error: resultData?.result
        })
      }
    } catch (error) {
      setMessages({ ...messages, loading: false, error: [error.Messages] })
    }
  }

  const startWebsocket = () => {
    var websocket = new WebSocket('wss://api.ordering.co/wss/');
    websocket.onopen = function () {
      console.log('Ws connect');
      console.log('msglnck')
          console.log(messages?.messages?.length)
        room = 'orderdish_messages_driver';

      var message = {
        handle: 'room',
        room: room
      };
      websocket.send(JSON.stringify(message));
    };
    websocket.onclose = function () {
      websocket = null;
      startWebsocket();
    };
    websocket.onerror = function () {
      websocket.close();
    };
    websocket.onmessage = function (evt) {
      var packet = JSON.parse(evt.data);
      switch (packet.handle) {
        case 'drivermessage':
          var s_message = JSON.parse(packet.data);
          setMessages({
            ...messages,
            messages: [
              ...messages.messages,
              s_message
            ]
          })
          break;
        default:
        console.log('ss')
        console.log(packet);
        break;
      }
    };
  }

  /**
   * Method to Load message for first time
   * @param {number} messageId order message Id
   */
  const handleReadMessages = async (messageId) => {
    if (orderMessages && setOrderMessages) return
    try {
      setReadMessages({ ...readMessages, loading: true })
      const functionFetch = `${ordering.root}/orders/${authorId}/messages/${messageId}/read?order_id=${authorId}&order_message_id=${messageId}`
      const response = await fetch(functionFetch, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } })
      const { error, result } = await response.json()
      if (!error) {
        setReadMessages({
          messages: result,
          loading: false,
          error: null
        })
        if (messages.messages.length > 0) {
          const _messages = messages.messages.filter(message => {
            if (message.id === messageId) {
              message.read = true
            }
            return true
          })
          setMessages({ ...messages, messages: _messages })
        }
        handleUpdateOrderForUnreadCount && handleUpdateOrderForUnreadCount(null)
        handleUpdateOrderForUnreadCount && handleUpdateOrderForUnreadCount(authorId)
      } else {
        setReadMessages({
          ...readMessages,
          loading: false,
          error: result
        })
      }
    } catch (error) {
      setReadMessages({ ...readMessages, loading: false, error: [error.Messages] })
    }
  }

  useEffect(() => {
    if (orderMessages && setOrderMessages) return
    loadMessages()
  }, [authorId])

  useEffect(() => {
    if (messages.loading || (orderMessages && setOrderMessages)) return
    const handleNewMessage = (message) => {
      if (message.order?.id === authorId || message?.order_id === authorId) {
        const found = messages.messages.find(_message => _message.id === message.id)
        if (!found) {
          setMessages(prevState => ({
            ...prevState,
            messages: [...prevState.messages, message]
          }))
        }
      }
    }
    socket.on('message', handleNewMessage)
    return () => {
      socket.off('message', handleNewMessage)
    }
  }, [messages, socket])

  useEffect(() => {
    if (!messages.loading) {
      if (!websocketRef.current) {
        console.log('Messages loaded, starting WebSocket');
        startWebsocket();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!socket?.socket) return
    if (asDashboard) {
      socket.join(`messages_orders_${authorId}_${user?.level}`)
    } else {
      socket.join(`messages_orders_${user?.id}`)
    }
    socket.socket.on('connect', () => {
      if (asDashboard) {
        socket.join(`messages_orders_${authorId}_${user?.level}`)
      } else {
        socket.join(`messages_orders_${user?.id}`)
      }
    })
    return () => {
      if (asDashboard) {
        socket.leave(`messages_orders_${authorId}_${user?.level}`)
      } else {
        socket.leave(`messages_orders_${user?.id}`)
      }
    }
  }, [socket?.socket, authorId])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          messages={messages}
          image={image}
          canRead={canRead}
          handleSend={handleSend}
          message={message}
          handleReadMessages={handleReadMessages}
          setMessage={setMessage}
          setCanRead={setCanRead}
          sendMessage={sendMessage}
          setImage={setImage}
          getHistoryComment={getHistoryComment}
        />
      )}
    </>
  )
}

Messages.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Custom Send messageS
   * @param {object} message Message to send
   */
  handleClickSetDefault: PropTypes.func,
  /**
   * @param {object} message
   * handleCustomClick, function to get click event and return message without default behavior
   */
  customHandleSend: PropTypes.func
}
