
export function setStatus(ref) {
    let icons = ref.getElementsByTagName("i");
    let icon = icons[icons.length - 1];
    let input = ref.getElementsByTagName("input")[0];
    let message = ref.lastElementChild;
    let svg = icon.firstElementChild;

    icon.classList.remove("is-hidden");
    message.classList.remove("is-hidden");

    const danger = () => {
        input.classList.add("is-danger");
        input.classList.remove("is-success");
        message.classList.add("is-danger");
        message.classList.remove("is-success");
        svg.classList.add("fa-exclamation-circle");
        svg.classList.remove("fa-check");
    };

    const success = () => {
        input.classList.add("is-success");
        input.classList.remove("is-danger");
        message.classList.add("is-success");
        message.classList.remove("is-danger");
        svg.classList.add("fa-check");
        svg.classList.remove("fa-exclamation-circle");
    };

    return {danger, success}
}
