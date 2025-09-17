import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useLanguage, CODES } from '@components';
import { ORDER_TYPES } from '../config/constants';
import { CURRENCY } from '../config/currency'

export const flatArray = (arr: any) => [].concat(...arr);

/**
 * Function to convert a string in string capitalized
 * @param {string} str string to capitalize
 */
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * List of order type
 */
export const orderTypeList = ['delivery', 'pickup', 'eatin', 'curbside', 'drivethru', 'seatdelivery']


/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export const getTraduction = (key: string, t: any) => {
  const keyList: any = {
    // Add the key and traduction that you need below
    ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
    ERROR_INVALID_COUPON: "The coupon doesn't exist",
    ERROR_IVALID_COUPON_MINIMUM:
      'You must have more products in your cart to use the coupon',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP:
      'The business is too far for order type pickup',
    ERROR_PLACE_PAY_WITH_CARD2: 'An error occurred while trying to pay by card',
    ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
    INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
    ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
    YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
    INVALID_CODE: 'Invalid verify code',
    STRIPE_ERROR: 'Payment service error. Try again later.',
    ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
    ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
    ERROR_YOU_HAVE_ACTIVE_CART: "You can't reorder this cart",
    ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
    ERROR_PLACE_PAY_WITH_REDIRECT:
      'An error occurred while trying to pay by redirect',
    ERROR_PLACE_PAY_WITH_CARD1: 'An error occurred while trying to pay by card',
    ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE:
      'An error occurred while trying to pay by PayPal',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY:
      'Error adding product, very far for delivery',
    ERROR_PRODUCT_NOT_FOUND: 'Error with the product',
    ERROR_USER_UPDATE_YOU_HAVE_ASSIGNED_ORDERS:
      "You can't because you have assigned orders",
    ERROR_INVALID_OFFER: 'The offer doesn\'t exist',
    ERROR_AUTH_DRIVER_LOGIN_VALIDATION: 'Error auth driver login validation',
    ERROR_DRIVER_UPDATE_SCHEDULE: 'Error driver update schedule',
    ERROR_ADD_BUSINESS_INVALID: 'An error occurred with the business',
    ERROR_ADD_PRODUCT_BEFORE_ADDRESS: 'You must have an address'
  };
  return keyList[key]
    ? t(key, keyList[key])
    : (typeof key === 'string')
      ? (/^[^\s]*_[^\s]*$/.test(key))
        ? t(key, capitalize(key.replace(/_/g, ' ').toLowerCase()))
        : t(key.replace(/ /g, '_').toUpperCase(), key)
      : null
};

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  if (!time) return '0min';
  const [hour, minute] = time.split(':');
  const result = parseInt(hour, 10) * 60 + parseInt(minute, 10);
  return `${result}min`;
};

export const getIconCard = (brand: string, size: number) => {
  const value = brand?.toLowerCase();
  switch (value) {
    case 'visa':
      return (
        FontAwesome && <FontAwesome name="cc-visa" size={size} color={'#000'} />
      );
    case 'mastercard':
      return (
        FontAwesome && (
          <FontAwesome name="cc-mastercard" size={size} color={'#000'} />
        )
      );
    case 'amex':
      return (
        FontAwesome && <FontAwesome name="cc-amex" size={size} color={'#000'} />
      );
    case 'discover':
      return (
        FontAwesome && (
          <FontAwesome name="cc-discover" size={size} color={'#000'} />
        )
      );
    case 'jcb':
      return (
        FontAwesome && <FontAwesome name="cc-jcb" size={size} color={'#000'} />
      );
    case 'diners-club':
      return (
        FontAwesome && (
          <FontAwesome name="cc-diners-club" size={size} color={'#000'} />
        )
      );
    default:
      return (
        FontAwesome && (
          <FontAwesome name="credit-card-alt" size={size} color={'#000'} />
        )
      );
  }
};
/**
 * Function to return a static google maps image based in location
 * @param {object} param object with latitude and logitude
 */
export const getGoogleMapImage = ({ lat, lng }: any, apiKey: string) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=500x190&center=${lat},${lng}&zoom=17&scale=2&maptype=roadmap&&markers=icon:https://res.cloudinary.com/ditpjbrmz/image/upload/f_auto,q_auto,w_45,q_auto:best,q_auto:best/v1564675872/marker-customer_kvxric.png%7Ccolor:white%7C${lat},${lng}&key=${apiKey}`;
};
/**
 * List of fields with correct order
 */
export const fieldsToSort = [
  'name',
  'middle_name',
  'lastname',
  'second_lastname',
  'email',
];
/**
 * Function to return a array sorted by certain fields
 * @param fields Array with right order
 * @param array Array to sort
 */
export const sortInputFields = ({ fields, values }: any) => {
  let fieldsBase = fields;
  const fieldsSorted: any = [];
  const fieldsArray = Array.isArray(values)
    ? values
    : values && Object.values(values);

  if (!fieldsBase) {
    fieldsBase = fieldsToSort;
  }

  fieldsBase.forEach((f: any) => {
    fieldsArray &&
      fieldsArray.forEach((field: any) => {
        if (f === field.code) {
          fieldsSorted.push(field);
        }
      });
  });
  return fieldsSorted;
};

export const transformCountryCode = (countryCode: number) => {
  const code = CODES.find((code: any) => code.phoneCode === countryCode);
  return code?.countryCode;
};

export const findExitingCode = (countryCode: string) => {
  const code = CODES.find((code: any) => code.countryCode === (countryCode || '').toUpperCase())
  return code?.countryCode
}

/**
 * Function to check if a number is decimal or not
 * @param {*} value number to check if decimal or not
 * @param {*} parser function fallback when is decimal
 * @returns string
 */
export const verifyDecimals = (value: number, parser: any, options?: any) => {
  if (value % 1 === 0) {
    return value;
  } else {
    return options ? parser(value, options) : parser(value);
  }
};

export const getProductPrice = (product: any) => {
  let subOptionPrice = 0;
  if (product.options.length > 0) {
    for (const option of product.options) {
      for (const suboption of option.suboptions) {
        subOptionPrice += suboption.quantity * suboption.price;
      }
    }
  }

  const price = product.quantity * (product.price + subOptionPrice);
  return price;
};

export const transformDistance = (value: number, distanceUnit?: string) => {
  return distanceUnit === 'mi'
    ? (value / 1.609).toFixed(2)
    : distanceUnit === 'ft'
      ? (value * 3280.84).toFixed(0)
      : (value).toFixed(2)
}

export const formatSeconds = (seconds: number) => {
  // Hours, minutes and seconds
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  // Output like '1:01' or '4:03:59' or '123:03:59'
  let ret = ''
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

export const calculateDistance = (
  pointA: { lat: number; lng: number },
  pointB: { latitude: number; longitude: number },
) => {
  const lat1 = pointA.lat;
  const lon1 = pointA.lng;

  const lat2 = pointB?.latitude;
  const lon2 = pointB?.longitude;

  const R = 6371e3;
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  const distanceInKm = distance / 1000;
  return distanceInKm;
};


/**
 * Change local moment variables
 */
export const setLocalMoment = (moment: any, t: any) => {
  moment.locale('custom', {
    months: [
      t('MONTH1', 'January'),
      t('MONTH2', 'February'),
      t('MONTH3', 'March'),
      t('MONTH4', 'April'),
      t('MONTH5', 'May'),
      t('MONTH6', 'June'),
      t('MONTH7', 'July'),
      t('MONTH8', 'August'),
      t('MONTH9', 'September'),
      t('MONTH10', 'October'),
      t('MONTH11', 'November'),
      t('MONTH12', 'December')
    ],
    monthsShort: [
      t('MONTHSHORT1', 'Jan'),
      t('MONTHSHORT2', 'Feb'),
      t('MONTHSHORT3', 'Mar'),
      t('MONTHSHORT4', 'Apr'),
      t('MONTHSHORT5', 'May'),
      t('MONTHSHORT6', 'Jun'),
      t('MONTHSHORT7', 'Jul'),
      t('MONTHSHORT8', 'Aug'),
      t('MONTHSHORT9', 'Sep'),
      t('MONTHSHORT10', 'Oct'),
      t('MONTHSHORT11', 'Nov'),
      t('MONTHSHORT12', 'Dec')
    ],
    weekdays: [
      t('DAY7', 'Sunday'),
      t('DAY1', 'Monday'),
      t('DAY2', 'Tuesday'),
      t('DAY3', 'Wednesday'),
      t('DAY4', 'Thursday'),
      t('DAY5', 'Friday'),
      t('DAY6', 'Saturday')
    ],
    weekdaysShort: [
      t('DAYSHORT7', 'Sun'),
      t('DAYSHORT1', 'Mon'),
      t('DAYSHORT2', 'Tue'),
      t('DAYSHORT3', 'Wed'),
      t('DAYSHORT4', 'Thu'),
      t('DAYSHORT5', 'Fri'),
      t('DAYSHORT6', 'Sat')
    ],
    weekdaysMin: [
      t('DAYMIN7', 'Su'),
      t('DAYMIN1', 'Mo'),
      t('DAYMIN2', 'Tu'),
      t('DAYMIN3', 'We'),
      t('DAYMIN4', 'Th'),
      t('DAYMIN5', 'Fr'),
      t('DAYMIN6', 'Sa')
    ],
    meridiem: function (hours: any) {
      return hours < 12 ? t('AM', 'AM') : t('PM', 'PM');
    }
  })
}

export const monthsEnum: any = {
  Jan: 'MONTHSHORT1',
  Feb: 'MONTHSHORT2',
  Mar: 'MONTHSHORT3',
  Apr: 'MONTHSHORT4',
  May: 'MONTHSHORT5',
  Jun: 'MONTHSHORT6',
  Jul: 'MONTHSHORT7',
  Aug: 'MONTHSHORT8',
  Sep: 'MONTHSHORT9',
  Oct: 'MONTHSHORT10',
  Nov: 'MONTHSHORT11',
  Dec: 'MONTHSHORT12',
}

export const locale = (languageState: any, t: any) => {
  return {
    name: languageState?.language?.code?.slice(0, 2),
    config: {
      months: [
        t('MONTH1', 'January'),
        t('MONTH2', 'February'),
        t('MONTH3', 'March'),
        t('MONTH4', 'April'),
        t('MONTH5', 'May'),
        t('MONTH6', 'June'),
        t('MONTH7', 'July'),
        t('MONTH8', 'August'),
        t('MONTH9', 'September'),
        t('MONTH10', 'October'),
        t('MONTH11', 'November'),
        t('MONTH12', 'December')
      ],
      weekdaysShort: [
        t('DAYSHORT7', 'Sun'),
        t('DAYSHORT1', 'Mon'),
        t('DAYSHORT2', 'Tue'),
        t('DAYSHORT3', 'Wed'),
        t('DAYSHORT4', 'Thu'),
        t('DAYSHORT5', 'Fri'),
        t('DAYSHORT6', 'Sat')
      ],
    }
  }
};

export const getTypesText = (value: number) => {
  const ret = ORDER_TYPES.find((type: any) => type.value == value);
  return ret?.content;
}

/**
 * List shape for ribbon
 */
export const shape = {
  rectangle: 'rectangle',
  rectangleRound: 'rectangle_round',
  capsuleShape: 'capsule_shape'
}

/**
 * Function to transform degree to radian
 * @param {number} value for transform
 *
 */
export const convertToRadian = (value: number) => {
  return value * Math.PI / 180
}

/**
 * Function to distance between two locations
 * @param lat1 Lat for first location
 * @param lon1 Lon for first location
 * @param lat2 Lat for second location
 * @param lon2 Lon for second location
 */
export const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371 // km
  const dLat = convertToRadian(lat2 - lat1)
  const dLon = convertToRadian(lon2 - lon1)
  const curLat1 = convertToRadian(lat1)
  const curLat2 = convertToRadian(lat2)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const formatUrlVideo = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const id = (match && match[7].length === 11) ? match[7] : false
  return `https://www.youtube-nocookie.com/embed/${id}`
}

/**
 * List of price to filter businesses
 */
export const priceList = [
  { level: '1', content: '$' },
  { level: '2', content: '$$' },
  { level: '3', content: '$$$' },
  { level: '4', content: '$$$$' },
  { level: '5', content: '$$$$$' }
]

export const getLogisticTag = (status: any, t: any) => {
  const keyList: any = {
    0: t('PENDING', 'Pending'),
    1: t('IN_PROGRESS', 'In progress'),
    2: t('IN_QUEUE', 'In queue'),
    3: t('EXPIRED', 'Expired'),
    4: t('RESOLVED', 'Resolved'),
  }
  return keyList[status] ? keyList[status] : t('UNKNOWN', 'Unknown')
}

export const getOrderStatus = (s: string, t: any) => {
  const status = parseInt(s);
  const orderStatus = [
    {
      key: 0,
      value: t('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.25,
    },
    {
      key: 1,
      value: t('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
    },
    {
      key: 2,
      value: t('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
    },
    {
      key: 3,
      value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
      slug: 'DRIVER_IN_BUSINESS',
      percentage: 0.6,
    },
    {
      key: 4,
      value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
      slug: 'PREPARATION_COMPLETED',
      percentage: 0.7,
    },
    {
      key: 5,
      value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
    },
    {
      key: 6,
      value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
      slug: 'REJECTED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 7,
      value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.35,
    },
    {
      key: 8,
      value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
      slug: 'ACCEPTED_BY_DRIVER',
      percentage: 0.45,
    },
    {
      key: 9,
      value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
      slug: 'PICK_UP_COMPLETED_BY_DRIVER',
      percentage: 0.8,
    },
    {
      key: 10,
      value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
      slug: 'PICK_UP_FAILED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 11,
      value: t(
        'DELIVERY_COMPLETED_BY_DRIVER',
        'Delivery completed by driver',
      ),
      slug: 'DELIVERY_COMPLETED_BY_DRIVER',
      percentage: 1,
    },
    {
      key: 12,
      value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
      slug: 'DELIVERY_FAILED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 13,
      value: t('PREORDER', 'PreOrder'),
      slug: 'PREORDER',
      percentage: 0,
    },
    {
      key: 14,
      value: t('ORDER_NOT_READY', 'Order not ready'),
      slug: 'ORDER_NOT_READY',
      percentage: 0,
    },
    {
      key: 15,
      value: t(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
      slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
      percentage: 1,
    },
    {
      key: 16,
      value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
      slug: 'CANCELLED_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 17,
      value: t(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
      slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 18,
      value: t(
        'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS',
        'Driver almost arrived to business',
      ),
      slug: 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS',
      percentage: 0.15,
    },
    {
      key: 19,
      value: t(
        'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER',
        'Driver almost arrived to customer',
      ),
      slug: 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER',
      percentage: 0.9,
    },
    {
      key: 20,
      value: t(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
      percentage: 0.9,
    },
    {
      key: 21,
      value: t(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
      percentage: 0.95,
    },
    {
      key: 22,
      value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
      slug: 'ORDER_LOOKING_FOR_DRIVER',
      percentage: 0.35,
    },
    {
      key: 23,
      value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'),
      slug: 'ORDER_DRIVER_ON_WAY',
      percentage: 0.45,
    },
    {
      key: 24,
      value: t('ORDER_DRIVER_WAITING_FOR_ORDER', 'Driver waiting for order'),
      slug: 'ORDER_DRIVER_WAITING_FOR_ORDER',
      percentage: 0.25
    },
    {
      key: 25,
      value: t('ORDER_ACCEPTED_BY_DRIVER_COMPANY', 'Accepted by driver company'),
      slug: 'ORDER_ACCEPTED_BY_DRIVER_COMPANY',
      percentage: 0.25
    },
    {
      key: 26,
      value: t('ORDER_DRIVER_ARRIVED_CUSTOMER', 'Driver arrived to customer'),
      slug: 'ORDER_DRIVER_ARRIVED_CUSTOMER',
      percentage: 0.8
    }
  ];

  const objectStatus = orderStatus.find((o) => o.key === status);

  return objectStatus && objectStatus;
}

export const getOrderStatuPickUp = (s: any, t: any) => {
  const status = parseInt(s);
  const orderStatus = [
    {
      key: 0,
      value: t('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.1,
    },
    {
      key: 1,
      value: t('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
    },
    {
      key: 2,
      value: t('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
    },
    {
      key: 4,
      value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
      slug: 'PREPARATION_COMPLETED',
      percentage: 0.5,
    },
    {
      key: 5,
      value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
    },
    {
      key: 7,
      value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.3,
    },
    {
      key: 13,
      value: t('PREORDER', 'PreOrder'),
      slug: 'PREORDER',
      percentage: 0,
    },
    {
      key: 14,
      value: t('ORDER_NOT_READY', 'Order not ready'),
      slug: 'ORDER_NOT_READY',
      percentage: 0.3,
    },
    {
      key: 15,
      value: t(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
      slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
      percentage: 1,
    },
    {
      key: 16,
      value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
      slug: 'CANCELLED_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 17,
      value: t(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
      slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 20,
      value: t(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
      percentage: 0.7,
    },
    {
      key: 21,
      value: t(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
      percentage: 0.9,
    }
  ];

  const objectStatus = orderStatus.find((o) => o.key === status);

  return objectStatus && objectStatus;
}

/**
 * Function to get brightness of color.
 */
export const lightenDarkenColor = (color: any) => {

  let r, g, b, hsp
  if (!color) return
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If RGB --> Convert it to HEX
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = color >> 8 & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  )

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 197) {
    return true //is light color
  } else {
    return false
  }
}

/**
 * function to manage order comment list
 * @param {string} param0 type of orders to return
 * @returns object with orders dictionary
 */
export const orderCommentList = (value: string) => {
  const [, t] = useLanguage()
  const dictionary: any = {
    reject: 6,
    forcePickUp: 9,
    pickupFailed: 10,
    forceDelivery: 11,
    deliveryFailed: 12,
    notReady: 14
  }

  const status = dictionary[value]

  const messages: any = {
    6: [// on reject order
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'unavailable_driver',
      'other'
    ],
    9: [// on force pickup status
      'forgot_complete_location',
      'not_internet_conection',
      'other'
    ],
    10: [// on pickup failed by driver
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'store_closed',
      'unavailable_driver',
      'other'
    ],
    11: [// on force delivery status
      'forgot_complete_location',
      'not_internet_conection',
      'other'
    ],
    12: [// on delivery failed by driver
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'recipient_unavailable',
      'incorrect_missing_items',
      'refused_damage',
      'other'
    ],
    14: [// on order not ready
      'store_recieve_order_late',
      'store_busy',
      'other'
    ]
  }

  if (!messages[status]) return null

  const list = messages[status].map((val: any, i: number) => ({ key: i, value: val, content: t(`REJECT_REASON_${val.toUpperCase()}`, val.replace(/_/g, ' ')) }))

  return { list }
}

/**
 * function to manage review comment list
 * @param {number} param0 type of reviews to return
 * @returns object with reviews dictionary
 */
export const reviewCommentList = (type: string) => {
  const [, t] = useLanguage()
  // TODO: improve this function
  const reviews: any = {
    order: {
      1: {
        title: t('QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: t('QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: t('QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: t('QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    customer: {
      1: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_1_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_1_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_2_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_2_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_3_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_3_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_4_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_4_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_5_1', "Friendly") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_5_2', "Above and beyond") },
        ]
      },
    },
    driver: {
      1: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    product: {
      like: [
        { key: 0, content: t('QUICK_COMMENT_LIKE_0', "Tasty") },
        { key: 1, content: t('QUICK_COMMENT_LIKE_1', "Good price") },
        { key: 2, content: t('QUICK_COMMENT_LIKE_2', "Good portion size") },
        { key: 3, content: t('QUICK_COMMENT_LIKE_3', "Packed well") },
      ],
      dislike: [
        { key: 0, content: t('QUICK_COMMENT_DISLIKE_0', "Not tasty") },
        { key: 1, content: t('QUICK_COMMENT_DISLIKE_1', "High price") },
        { key: 2, content: t('QUICK_COMMENT_DISLIKE_2', "Bad portion size") },
        { key: 3, content: t('QUICK_COMMENT_DISLIKE_3', "Not packed well") },
      ]
    }
  }

  return reviews[type]
}

export const getCurrenySymbol = (code: keyof typeof CURRENCY) => {
  return CURRENCY[code]?.symbol ?? code
}
