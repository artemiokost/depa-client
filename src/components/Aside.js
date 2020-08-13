import React from "react";
import CommentList from "./lists/CommentList";

const Aside = () => (
    <div className="column is-3 is-hidden-touch">
        <CommentList/>
    </div>
);

export default Aside
