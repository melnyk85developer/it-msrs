import { HTTP_STATUSES } from "src/core/utils/utils"
import { SHOP_INTERNAL_STATUS } from "./shopsStatus"

export const SHOP_ERRORS = {
    // SHOP
    [SHOP_INTERNAL_STATUS.NOT_FOUND_MY_SHOPS]: {
        messages: { message: 'Ваших магазинов не найденно!', field: 'shops' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_SHOPS]: {
        messages: { message: 'Магазинов не найденно!', field: 'shops' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_SHOP]: {
        messages: { message: 'Такого магазина не обнаружено!', field: 'shop' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_SHOP_TYPE]: {
        messages: { message: 'Такого типа магазина не обнаружено!', field: 'shop-type' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_PRODUCT_TYPE]: {
        messages: { message: 'Такого типа товара в магазине не существует!', field: 'product-type' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_BASKET]: {
        messages: { message: 'Такой корзины не обнаружено!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_BASKETID]: {
        messages: { message: 'Корзины с таким basketId не найденно!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_CARTS_WITH_THIS_DEVICEID_WERE]: {
        messages: { message: 'Корзины с таким id товара не найденно!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_THERE_PRODUCT_IS_NO_SUCH_THING]: {
        messages: { message: 'Такого продукта не существует!', field: 'product' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_PRODUCT]: {
        messages: { message: 'Такого товара не найдено!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_PRODUCT_ID]: {
        messages: { message: 'Не корректный или не существует id для обновления товара в магазине!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_CART_WITH_THESE_ITEMS_WAS]: {
        messages: { message: 'Корзины с такими товарами не найдено!', field: 'basket' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_SUCH_BRAND_WAS]: {
        messages: { message: 'Такого бренда не найдено!', field: 'brand' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.FORBIDDEN_CREATED_BRAND]: {
        messages: { message: 'Не удачное создание бренда!', field: 'brand' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_THIS_BRAND_OF_PRODUCT_DOES_NOT_EXIST_FOR_RENEWAL]: {
        messages: { message: 'Такого бренда товара не существует для обновления!', field: 'brand' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [SHOP_INTERNAL_STATUS.NOT_FOUND_THIS_BRAND_OF_PRODUCT_DOES_NOT_EXIST_FOR_REMOVAL]: {
        messages: { message: 'Такого бренда товара не существует для удаления!', field: 'brand' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    // SHOP
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_CREATION]: {
        messages: { message: 'Не корректные данные для создания магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_TYPE_CREATION]: {
        messages: { message: 'Не корректные данные для создания типа магазина!', field: 'shop-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_TYPE_UPDATED]: {
        messages: { message: 'Не корректные данные для обновления типа магазина!', field: 'shop-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_PRODUCT_TYPE_CREATED]: {
        messages: { message: 'Не корректные данные для создания типа товара в магазине!', field: 'product-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_PRODUCT_TYPE_UPDATED]: {
        messages: { message: 'Не корректные данные для обновления типа товара в магазине!', field: 'product-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_PRODUCT_TYPE_DELETED]: {
        messages: { message: 'Не корректные данные для удаления типа товара в магазине!', field: 'product-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_TYPE_DELETED]: {
        messages: { message: 'Не корректные данные для удаления типа магазина!', field: 'shop-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_SHOP_TYPEID]: {
        messages: { message: 'Не корректный id типа магазина!', field: 'shop-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_SHOP_PRODUCT_TYPEID]: {
        messages: { message: 'Не корректный id типа товара!', field: 'product-type' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_ERROR_CREATED_SHOP]: {
        messages: { message: 'Что-то пошло не так при создании магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_UPDATED]: {
        messages: { message: 'Не корректные данные для обновлении магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_SHOP_DELETED]: {
        messages: { message: 'Не корректные данные для удаления магазина!', field: 'produkt' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_ADDING_A_PRODUCT_TO_THE_STORE]: {
        messages: { message: 'Не корректные данные для добавления товара в магазин!', field: 'produkt' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATING_A_PRODUCT_TO_THE_STORE]: {
        messages: { message: 'Не корректные данные для обновления товара в магазине!', field: 'shop' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_SHOPID]: {
        messages: { message: 'Не корректный shopId!', field: 'shopId' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_BRANDID]: {
        messages: { message: 'Не корректный brandId!', field: 'brandId' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_REQUEST_FOR_DATA_TO_ADD_A_BRAND]: {
        messages: { message: 'Не валидные данные для создания бренда товара в магазине!', field: 'brand' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_WRONG_DATA_REQUEST_FOR_BRAND_UPDATE]: {
        messages: { message: 'Не валидные данные для обновления бренда товара в магазине!', field: 'brand' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_FOR_INVALID_DATA_FOR_BRAND_DELETION]: {
        messages: { message: 'Не корректные данные для удаления бренда товара!', field: 'brand' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_BASKET]: {
        messages: { message: 'Не корректные данные для корзины!', field: 'basketId' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_ADDING_AN_ITEM_TO_CART]: {
        messages: { message: 'Не корректные данные для добавления товара в корзину!', field: 'basket' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.BAD_REQUEST_FOR_INCORRECT_DATA_TO_REMOVE_AN_ITEM_FROM_THE_CART]: {
        messages: { message: 'Не корректные данные для удаления товара из корзины!', field: 'basket' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [SHOP_INTERNAL_STATUS.FORBIDDEN_REJECTED_ON_RECEIPT_OF_GOODS_FROM_THE_DATABASE]: {
        messages: { message: 'Отклонено при получении товара из базы данных!', field: 'product' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
}
export const SHOP_STATUS_POSITIVE = {
    [SHOP_INTERNAL_STATUS.SUCCESS_CREATED_SHOP]: {
        messages: { message: 'Успешное создание магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [SHOP_INTERNAL_STATUS.SUCCESS_UPDATED_SHOP]: {
        messages: { message: 'Успешное обновление магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [SHOP_INTERNAL_STATUS.SUCCESS_DELETED_SHOP]: {
        messages: { message: 'Успешное удаление магазина!', field: 'shop' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}