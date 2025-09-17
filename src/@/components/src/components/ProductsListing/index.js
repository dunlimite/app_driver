import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useApi } from '../../contexts/ApiContext'
import { useOrder } from '../../contexts/OrderContext'

export const ProductsListing = (props) => {
  props = { ...defaultProps, ...props }
  const {
    useCategorySelectedForProducts,
    isSearchByName,
    isSearchByDescription,
    businessId,
    UIComponent,
    categorySelected
  } = props

  const [ordering] = useApi()
  const [orderState] = useOrder()

  /**
   * This must be contains search value from UI
   */
  const [searchValue, setSearchValue] = useState(null)
  /**
   * This must be contains category selected by user
   */
  const [categoryValue, setCategoryValue] = useState(categorySelected)
  /**
   * Object to save products, loading and error values
   */
  const [productsList, setProductsList] = useState({ products: [], loading: true, error: false })

  /**
   * List of business categories
   */
  const [categories, setCategories] = useState([])

  /**
   * Method to check if a product match with search value
   * @param {string} name
   * @param {*string} description
   */
  const isMatchSearch = (name, description) => {
    if (!searchValue) return true
    return (name.toLowerCase().includes(searchValue.toLowerCase()) && isSearchByName) ||
      (description.toLowerCase().includes(searchValue.toLowerCase()) && isSearchByDescription)
  }

  /**
   * Method to check if a product match with search value
   * @param {number} category
   */
  const isMatchCategory = (categoryId) => {
    if (!categoryValue) return true
    return Number(categoryId) === Number(categoryValue)
  }

  /**
   * Method to get products from API
   */
  const getProducts = async () => {
    try {
      setProductsList({
        ...productsList,
        loading: true
      })
      const businessesFetch = ordering.businesses(businessId)
      const fetchFunction =
        useCategorySelectedForProducts && categoryValue
          ? businessesFetch.categories(categoryValue?.id).products()
          : businessesFetch
      const { content: { result } } = await fetchFunction
        .parameters({ type: orderState.options?.type || 1 })
        .get()

      const productsFiltered = (searchValue || categoryValue) && !useCategorySelectedForProducts
        ? result.filter(product => isMatchSearch(product.name, product.description) && isMatchCategory(product.category_id))
        : result

      setProductsList({
        ...productsList,
        loading: false,
        products: productsFiltered
      })
    } catch (error) {
      setProductsList({
        ...productsList,
        loading: false,
        error
      })
    }
  }

  /**
   * Method to get categories from api used business id
   */
  const getCategories = async () => {
    const { content: { result } } = await ordering.businesses(businessId).categories().get()
    setCategories(result)
  }

  useEffect(() => {
    getProducts()
  }, [searchValue, categoryValue])

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          categoryValue={!!categoryValue}
          categories={categories}
          productsList={productsList}
          handlerClickCategory={(val) => setCategoryValue(val)}
          handlerChangeSearch={(val) => setSearchValue(val)}
        />
      )}
    </>
  )
}

ProductsListing.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Businessid, this must be contains an business id for get data from API
   */
  businessId: PropTypes.number,
  /**
   * Enable/disable search by name
   */
  isSearchByName: PropTypes.bool,
  /**
   * Enable/disable search by description
   */
  isSearchByDescription: PropTypes.bool
}

const defaultProps = {
  isSearchByName: true,
  isSearchByDescription: true
}
