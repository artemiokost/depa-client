import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

const Pagination = ({number, path, totalPages}) => {

    path = path + "/page/";
    let isFirst = number === 1;
    let isLast = number === totalPages;

    const renderPageNumbers = (start, end) => {
        let pageNumbers = [];
        for (let i = start; i <= end; i++) pageNumbers.push(i);
        return pageNumbers.map(pageNumber =>
            <li key={pageNumber}>
                <NavLink className={(pageNumber === number) ? "pagination-link is-current" : "pagination-link"}
                         to={path + pageNumber}>{pageNumber}</NavLink>
            </li>
        )
    };

    if (totalPages > 1) return (
        <div className="pagination is-centered">
            <NavLink className="pagination-previous" disabled={isFirst}
                     to={path + (isFirst ? number : number - 1)}>Назад</NavLink>
            <NavLink className="pagination-next" disabled={isLast}
                     to={path + (isLast ? number : number + 1)}>Вперед</NavLink>
            <ul className="pagination-list">
                {totalPages < 9 ? renderPageNumbers(1, totalPages) : null}
                {totalPages > 8 && number === 1 ?
                    <Fragment>
                        {renderPageNumbers(1, 8)}
                        <li>
                            <span className="pagination-ellipsis">&hellip;</span>
                            <NavLink className="pagination-link" to={path + totalPages}>{totalPages}</NavLink>
                        </li>
                    </Fragment> : null}
                {totalPages > 8 && number === totalPages ?
                    <Fragment>
                        <li>
                            <NavLink className="pagination-link" to={path + 1}>1</NavLink>
                            <span className="pagination-ellipsis">&hellip;</span>
                        </li>
                        {renderPageNumbers(totalPages - 8, totalPages)}
                    </Fragment> : null}
                {totalPages > 8 && number !== 1 && number !== totalPages ?
                    <Fragment>
                        <li>
                            <NavLink className="pagination-link" to={path + 1}>1</NavLink>
                            <span className="pagination-ellipsis">&hellip;</span>
                        </li>
                        {renderPageNumbers(number - 2 > 1 ? number - 2 : 2,
                            number + 2 < totalPages ? number + 2 : totalPages - 1)}
                        <li>
                            <span className="pagination-ellipsis">&hellip;</span>
                            <NavLink className="pagination-link" to={path + totalPages}>{totalPages}</NavLink>
                        </li>
                    </Fragment> : null}
            </ul>
        </div>
    );
    return null
};

Pagination.propTypes = {
    number: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    totalPages: PropTypes.number
};

export default Pagination