import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSession } from 'ordering-components-external/native'
import { useApi } from 'ordering-components-external/native'
import { _retrieveStoreData, _setStoreData, _removeStoreData, _clearStoreData } from '../../providers/StoreUtil';
import settings from '../../config.json'
import { Alert } from 'react-native';
/**
 * Component to manage payment option stripe behavior without UI component
 */
export const PaymentOptionGreenPayv2 = (props) => {
  const {
    businessId,
    UIComponent
  } = props
  const [{ token, user }] = useSession()

  const [ordering] = useApi()
  const [addCartOpen2, setAddCardOpen2] = useState(false)
  const [addCartOpen, setAddCardOpen] = useState(false)
  /**
   * Contains and object to save cards, handle loading and error
   */
  const [cardsList, setCardsList] = useState({ cards: [], loading: true, error: null })
  /**
   * save stripe public key
   */
  const [publicKey, setPublicKey] = useState(props.publicKey)

  const [cardSelected, setCardSelected] = useState(null)
  const [cardDefault, setCardDefault] = useState(null)
  const [defaultCardSetActionStatus, setDefaultCardSetActionStatus] = useState({ loading: false, error: null })
  //const [authorizenewData, setauthorizenewData] = useState()
  
  const requestState = {}




  const [facCardData, setfacCardData] = useState({ 
    card_number: '', 
    exp_month: '', 
    exp_year: '',
    card_cvv: '',
    err_msg: ''
  })
  const handleChangeFacCard = () => {
    setfacCardData({ ...facCardData, 
      card_number: document.getElementById('card_number').value,
      err_msg: '' 
    })
  }
  const handleChangeFacMonth = () => {
    setfacCardData({ ...facCardData, 
      exp_month: document.getElementById('exp_month').value,
      err_msg: ''  
    })
  }
  const handleChangeFacYear = () => {
    setfacCardData({ ...facCardData, 
      exp_year: document.getElementById('exp_year').value,
      err_msg: ''  
    })
  }
  const handleChangeFacCvv = () => {
    setfacCardData({ ...facCardData, 
      card_cvv: document.getElementById('card_cvv').value,
      err_msg: ''  
    })
  }
  

  /**
   * method to get cards from API
   */

   const getCredentials = async () => {
    console.log('Fetch card API call....')
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        userid: user.id,
        project: settings?.project
      })
     
    }
   // console.log('Fetch card API call....'+JSON.stringify(requestOptions))
    const functionFetch = `https://plugins-development.ordering.co/vanvidelivery/greenpay/get_user_cards.php`
    const response = await fetch(functionFetch, requestOptions)
    const content = await response.json()
   // console.log("content==>"+JSON.stringify(content))
    const newCards = [];
    if(content.cards!='')
    {   
    // console.log(content.cards)
      setCardsList({
        ...cardsList,
        loading: false,
        cards: content.cards
      })    
    }else{
      setCardsList({
        ...cardsList,
        loading: false,
        cards: newCards
      })
    }     
   }//end getCredentials
 

  /**
   * method to get cards from API
   */
  const deleteCard = async (card) => {
    try {
      // The order of paymentCards params is businessId, userId, cardId. This sdk needs to be improved in the future,
      const { content: { error } } = await ordering.paymentCards(-1, user.id, card.id).delete()
      if (!error) {
        cardsList.cards = cardsList.cards.filter(_card => _card.id !== card.id)
        setCardsList({
          ...cardsList
        })
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  /**
   * method to set card as default
   */
  const setDefaultCard = async (card) => {
    try {
      setDefaultCardSetActionStatus({ ...defaultCardSetActionStatus, loading: true })
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          business_id: businessId,
          user_id: user.id,
          card_id: card.id
        })
      }
      const functionFetch = `${ordering.root}/payments/stripe/cards/default`
      const response = await fetch(functionFetch, requestOptions)
      const content = await response.json()
      if (!content.error) {
        setCardDefault({
          id: '1', //card.id,
          type: 'card',
          card: {
            brand: card.brand,
            last4: card.last4
          }
        })
        setDefaultCardSetActionStatus({ loading: false, error: null })
      } else {
        setDefaultCardSetActionStatus({ loading: false, error: content.result })
      }
    } catch (error) {
      setDefaultCardSetActionStatus({ loading: false, error: error })
    }
  }
  /**
   * Method to get stripe credentials from API
   */

  const handleCardClick = (card) => {
   // console.log(card)
    _setStoreData('fac-new-card', 2)
    setCardSelected({
      token: card.customerDatalast4,
      type: 'card',
      card_id: card.id,
      card: {        
        brand: card.id,
        last4: card.customerDatalast4
      }
    })
  }

  const handleNewCard = (card) => {
    cardsList.cards.push(card)
    setCardsList({
      ...cardsList
    })
    handleCardClick(card)
  }


  useEffect(() => {  
    getCredentials()
  }, [])

  useEffect(() => {
  
    if (token) {
     // getCards()
      if (!props.publicKey) {
       // getCredentials()
      }
    }
    return () => {
      if (requestState && requestState.paymentCards) {
       // requestState.paymentCards.cancel()
      }
    }
  }, [token])

  const generateTransactionId = () => {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 10; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}  
  const handlePay = async () => {
    console.log('add cart ');
    //console.log("FacCard Data"+JSON.stringify(facCardData));
   if(facCardData.card_number == ''){
     setfacCardData({ ...facCardData, err_msg: 'Please Enter card details' })
   }else if(facCardData.exp_month.length < 2 || parseInt(facCardData.exp_month) > 12){
     setfacCardData({ ...facCardData, err_msg: 'Please Enter Expiry Month(MM)' })
   }else if(facCardData.exp_year.length < 2){
     setfacCardData({ ...facCardData, err_msg: 'Please Enter Expiry Year(YY)' })
   }else if(facCardData.card_cvv.length < 3){
     setfacCardData({ ...facCardData, err_msg: 'Please Enter Expiry Card CVV' })
   }else{ 
    console.log('** save new card from here ***');
    setAddCardOpen2(true)
   }//end if
  }//end function

  const redSysDeleteCardnew = async (card) => {
	  //console.log("card==>"+JSON.stringify(card))
    try {
      // loading
      //setmyLoading(true)
      //setDefaultCardSetActionStatus({ ...defaultCardSetActionStatus, loading: true })
      const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        userid: user.id,
        token: card.id,
        project: settings?.project
      })
      }
      //console.log("DleterequestOptions==>"+JSON.stringify(requestOptions))
      const functionFetch = `https://plugins-development.ordering.co/vanvidelivery/greenpay/delete_card.php`
      const response = await fetch(functionFetch, requestOptions)
      const content = await response.json()
      console.log('After delete card json');
      const newCards = [];		
      const extngCardList = cardsList.cards;

      if(extngCardList.length > 0){
        alert('Card deletion successful')
        for(var i in cardsList.cards){
          console.log('card id:'+ cardsList.cards[i].id);
          if(cardsList.cards[i].id != card.id){
            newCards.push(cardsList.cards[i]);
          }
        }//end for

        setCardsList({
          ...cardsList,
          loading: false,
          cards: newCards
        })
      }else{  
        setCardsList({
          ...cardsList,
          loading: false,
          cards: newCards
        })
      }
      
    } catch (error) {
      //setDefaultCardSetActionStatus({ loading: false, error: error })
    }

}

const setAddCardOpenfnc = (card) => {
  setAddCardOpen2(false)
  setAddCardOpen(true)
  
}

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          cardSelected={cardSelected}
          cardDefault={cardDefault}
          cardsList={cardsList}
          handleCardClick={handleCardClick}
          publicKey={publicKey}
          handleNewCard={handleNewCard}
          deleteCard={deleteCard}
          setDefaultCard={setDefaultCard}
          defaultCardSetActionStatus={defaultCardSetActionStatus}
          handlePay={handlePay}
          handleChangeFacCard={handleChangeFacCard}
          handleChangeFacMonth={handleChangeFacMonth}
          handleChangeFacYear={handleChangeFacYear}
          handleChangeFacCvv={handleChangeFacCvv}
          facCardData={facCardData}
          addCartOpen2={addCartOpen2}
          redSysDeleteCardnew={redSysDeleteCardnew}
          setAddCardOpenfnc={setAddCardOpenfnc}
          addCartOpen={addCartOpen}
        />
      )}
    </>
  )
}

PaymentOptionGreenPayv2.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Business id to get cards from API
   */
  businessId: PropTypes.number.isRequired,
  /**
   * User id to pass in endpoint to get cards from API,
   */
  userId: PropTypes.number,
  /**
   * Components types before payment option stripe
   * Array of type components, the parent props will pass to these components
   */
  beforeComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Components types after payment option stripe
   * Array of type components, the parent props will pass to these components
   */
  afterComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Elements before payment option stripe
   * Array of HTML/Components elements, these components will not get the parent props
   */
  beforeElements: PropTypes.arrayOf(PropTypes.element),
  /**
   * Elements after payment option stripe
   * Array of HTML/Components elements, these components will not get the parent props
   */
  afterElements: PropTypes.arrayOf(PropTypes.element)
}

PaymentOptionGreenPayv2.defaultProps = {
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: []
}
