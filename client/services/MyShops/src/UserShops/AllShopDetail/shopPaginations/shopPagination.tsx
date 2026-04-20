import React from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { setPageAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import classes from './styles.module.scss';

const ShopPagination = () => {
    const dispatch = useAppDispatch()
    const { totalCount, limit, page } = useAppSelector(state => state.myShopsPage)

    const storPage = page
    const pages: Array<number> = []
    
    const pageCount = Math.ceil(totalCount / limit)

    for(let i = 0; i < pageCount; i++){
        pages.push(i + 1)
    }

    return (
        <div className={classes.shopPaginator}>
            {pages.map(page =>
                <strong 
                    key={page}
                    className={storPage === page ? 'active' : ''}
                    onClick={() => dispatch(setPageAC(page))}
                >
                    {page}
                </strong>
            )}
        </div>
    )
}
export default ShopPagination