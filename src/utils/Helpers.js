import * as moment from "moment";
import "moment/locale/ru";

export function distinct(value, index, self) {
    return self.indexOf(value) === index;
}

export function createPreview(content, length) {
    let body = extractBody(content, length).substring(0, length);
    return body.length < length ? body : body.concat("...")
}

export function extractBody(content, length) {
    let body = '';
    if (content != null && content.blocks != null) {
        for (let i = 0; i < content.blocks.length; i++) {
            body += content.blocks[i].text + ' ';
            if (body.length >= length) break
        }
    }
    return body
}

export function formatDate(timestamp) {
    return moment(timestamp).format("DD MMM YYYY")
}

export function formatDateTime(timestamp) {
    return moment(timestamp).local().format("DD MMM YYYY HH:MM")
}

export function fromNow(timestamp) {
    return moment(timestamp).fromNow()
}

export function switchSchemaByCategoryId(categoryId) {
    switch (categoryId) {
        case 1: return "Article";
        case 2: return "BlogPosting";
        case 3: return "NewsArticle";
        default: return "Article"
    }
}

export function wordEnd(num, words) {
    return words[((num = Math.abs(num % 100)) > 10 && num < 15) || (num %= 10) > 4 || num === 0 ? 2 : num === 1 ? 0 : 1]
}
