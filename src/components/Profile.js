import React, {Component, Fragment} from "react";
import classNames from "classnames";
import Avatar from "./Avatar";
import DatePicker, {createOptionForDate} from "./DatePicker";
import Indicator from "../containers/Indicator";
import NotFound from "../containers/errors/NotFound";
import PostList from "./lists/PostList";
import ProfileConfig from "./ProfileConfig";
import Select from "react-select";
import {connect} from "react-redux";
import {debounce} from "lodash";
import {formatDate} from "../utils/Helpers";
import {getUserSummaryByUserId, updateUserProfileById} from "../actions/userAction";
import {setStatus} from "../utils/FormValidatorHelper";
import {Helmet} from "react-helmet";
import {CHAR_ONLY_REGEX, DEFAULT_BIRTH_DATE, EMPTY, ROLE} from "../constants";
import {LOCATION_OPTIONS} from "../constants/options";
import {REACT_SELECT_STYLES} from "../constants/defaultStyles";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            birthDateOption: createOptionForDate(DEFAULT_BIRTH_DATE),
            isConfig: false,
            isEditing: false,
            gender: props.other.userSummary.gender,
            isFullName: false,
            locationOption: null,
            tabId: props.tabId || "infoTab",
            userId: props.match.params.userId
        };
        this.canopyProfile = React.createRef();
        this.aboutTextAria = React.createRef();
        this.fullName = React.createRef();
        this.fullNameInput = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {userId: nextProps.match.params.userId}
    }

    componentDidMount() {
        this._isMounted = true;
        window.addEventListener('scroll', this.handleScroll);
        this.props.getUserSummaryByUserId(this.state.userId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.updateFlag !== prevProps.updateFlag || this.state.userId !== prevState.userId) {
            this.props.getUserSummaryByUserId(this.state.userId, false);
            this.setState({isEditing: false})
        }
        if (this.props.other.userSummary !== prevProps.other.userSummary) {
            let {birthDate, location} = this.props.other.userSummary;
            this.setState({
                birthDateOption: createOptionForDate(birthDate ? birthDate : DEFAULT_BIRTH_DATE),
                locationOption: {value: location, label: location}
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('scroll', this.handleScroll);
    }

    fullNameValidator = debounce(() => {
        let value = this.fullNameInput.current.value;
        if (value === this.props.other.userSummary.fullName) {
            this.setState({isFullName: true});
            setStatus(this.fullName.current).success();
            return
        }
        if (CHAR_ONLY_REGEX.test(value)) {
            this.setState({isFullName: true});
            setStatus(this.fullName.current).success()
        } else {
            this.setState({isFullName: false});
            setStatus(this.fullName.current).danger()
        }
    }, 1000);

    handleBirthDate = (value) => this.setState({birthDateOption: value});

    handleGender = (e) => this.setState({gender: e.target.value});

    handleLocation = (value) => this.setState({locationOption: value});

    handleTab = (e) => this.setState({isConfig: false, isEditing: false, tabId: e.currentTarget.id});

    handleScroll = () => {
        if (this.canopyProfile.current) {
            let scrollTop = document.scrollingElement.scrollTop;
            if (scrollTop >= 100) this.canopyProfile.current.classList.add("narrow");
            else this.canopyProfile.current.classList.remove("narrow")
        }
    };

    toggleConfig = () => this.setState({isConfig: !this.state.isConfig});

    toggleEditing = () => this.setState({isEditing: !this.state.isEditing});

    update = () => {
        let {profileId, about, birthDate, fullName, gender, location} = this.props.current.userSummary;
        let {isFullName, birthDateOption, locationOption} = this.state;
        let aboutValue = this.aboutTextAria.current.value;
        let birthDateValue = birthDateOption.date.format("YYYY-MM-DD hh:mm:ss");
        let fullNameValue = this.fullNameInput.current.value;
        let genderValue = this.state.gender;
        let locationValue = locationOption.value;

        aboutValue = aboutValue?.trim() === '' ? EMPTY : aboutValue !== about ? aboutValue : null
        birthDateValue = !birthDateOption.date.isSame(birthDate, "day") ? birthDateValue : null;
        fullNameValue = isFullName && fullNameValue !== fullName ? fullNameValue : null;
        genderValue = genderValue !== gender ? genderValue : null;
        locationValue = locationValue !== location ? locationValue : null;

        let condition = aboutValue || birthDateValue || fullNameValue || genderValue || locationValue;

        if (condition) {
            let body = {
                about: aboutValue,
                birthDate: birthDateValue,
                fullName: fullNameValue,
                gender: genderValue,
                location: locationValue
            };
            this.props.updateProfileById(profileId, body)
        } else {
            this.toggleEditing()
        }
    };

    render() {
        let {inProcess, isAuthenticated, isFetching, current, other} = this.props;
        let {isConfig, isEditing, birthDateOption, locationOption, tabId} = this.state;
        let hasAuthority, hasInfo, isModerator;

        if (isAuthenticated) {
            hasAuthority = current.userSummary.userId === other.userSummary.userId;
            isModerator = current.userSummary.roles.includes(ROLE.MODERATOR);
        }

        let userSummary = hasAuthority ? current.userSummary : other.userSummary;
        let {userId, about, birthDate, fullName, gender, imageUrl, location, username, createdAt} = userSummary;
        hasInfo = fullName && about && birthDate && location;

        let renderInfo = () => (
            <div className="content profile my-1 p-1">
                <div className={"notification is-primary" + (!current.error ? " is-hidden" : '')}>
                    <button className="delete" onClick={() => this.props.setCurrentUserError(null)}/>
                    Извините, но изображение превышает максимально допустмые требования по размеру: <strong>100KB</strong>
                </div>
                <div className="columns">
                    {isEditing && hasAuthority ? renderSummaryEditing() : renderSummary()}
                    <div className="column"/>
                </div>
            </div>
        );

        let renderInvite = () => (
            <div className="content profile my-1 p-1">
                <div className="column is-centered">
                    <a onClick={this.toggleEditing}><i className="far fa-plus fa-lg"/></a>
                    <p style={{marginTop: "2rem"}}>Добавьте информацию о себе</p>
                </div>
            </div>
        );

        let renderPostList = () => (
            <div className="profile">
                <PostList management={true} userId={userId}/>
            </div>
        );

        let renderSummary = () => (
            <div className="column summary is-4-desktop">
                <div className="field">
                    <div className="bi-line">
                        <h2>{fullName}</h2>
                        {hasAuthority ?
                            <a className="bi-line-item is-centered" title="Отредактировать"
                               onClick={this.toggleEditing}><i className="far fa-pencil-alt"/></a> : null}
                    </div>
                </div>
                <div className="field">@{username}</div>
                {about ? <div className="field">{about}</div> : null}
                {location ?
                    <div className="field">
                        <i className="far fa-map-marker-alt"/>{location}
                    </div> : null}
                {gender ?
                    <div className="field">
                        <i className={gender === "male" ? "far fa-mars" : "far fa-venus"}/>
                        Пол: {gender === "male" ? "Мужской" : "Женский"}
                    </div> : null}
                <div className="field">
                    <i className="far fa-calendar-alt"/>Дата регистрации: {formatDate(createdAt)}
                </div>
                {birthDate ?
                    <div className="field">
                        <i className="far fa-birthday-cake"/>Дата рождения: {formatDate(birthDate)}
                    </div> : null}
            </div>
        );

        let renderSummaryEditing = () => (
            <div className="column summary is-4-desktop">
                <div className="field" ref={this.fullName}>
                    <label className="label">Полное имя</label>
                    <div className="control has-icons-right">
                        <input className="input" type="text" placeholder="Полное имя" defaultValue={fullName}
                               ref={this.fullNameInput} onInput={this.fullNameValidator}/>
                        <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                    </div>
                    <p className="help is-hidden">
                        {!this.state.isFullName ? "Поле должно содержать только буквы" : null}
                    </p>
                </div>
                <div className="field">
                    <label className="label">О себе</label>
                    <div className="control has-icons-left has-icons-right">
                            <textarea className="textarea" placeholder={"Я публицист от бога..."} defaultValue={about}
                                      ref={this.aboutTextAria}/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Страна</label>
                    <Select maxMenuHeight={380} options={LOCATION_OPTIONS} styles={REACT_SELECT_STYLES}
                            value={locationOption} onChange={this.handleLocation}/>
                </div>
                <div className="field">
                    <label className="label">Пол</label>
                    <div className="control">
                        <label className="radio">
                            <input type="radio" name="genderRadio" value="male"
                                   defaultChecked={this.state.gender === "male"}
                                   onChange={this.handleGender}/> Мужской
                        </label>
                        <label className="radio">
                            <input type="radio" name="genderRadio" value="female"
                                   defaultChecked={this.state.gender === "female"}
                                   onChange={this.handleGender}/> Женский
                        </label>
                        <label className="radio">
                            <input type="radio" name="genderRadio" value={EMPTY}
                                   defaultChecked={!this.state.gender || this.state.gender === EMPTY}
                                   onChange={this.handleGender}/> Отсутствует
                        </label>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Дата рождения D/M/Y</label>
                    <div className="control">
                        <DatePicker value={birthDateOption} onChange={this.handleBirthDate}/>
                    </div>
                </div>
                <button className={classNames("button is-success", {"is-loading": inProcess})}
                        onClick={this.update}>Готово</button>
            </div>
        );

        if (isFetching) return <Indicator/>;
        if (!isFetching && !userSummary) return <NotFound helmet={true} message="Содержимое не найдено :("/>;
        if (this._isMounted && userSummary) return (
            <Fragment>
                <Helmet>
                    <title>Профиль - Depa</title>
                    <meta name="description" content="Profile"/>
                </Helmet>

                <div className="canopy-profile" ref={this.canopyProfile}>
                    <div className="profile-header has-background-primary">
                        <div className="app-container">
                            <Avatar editing={hasAuthority} imageUrl={imageUrl}/>
                        </div>
                    </div>
                    <div className="navbar has-shadow">
                        <div className="container">
                            <div className="profile-card">
                                <div className="profile-card-group">
                                    <a className="profile-card-metadata">@{username}</a>
                                    <Avatar editing={hasAuthority} imageUrl={imageUrl} withMenu={false}/>
                                </div>
                            </div>
                            <div className="navbar-start">
                                <a id="infoTab"
                                   className={classNames("navbar-tab", {"is-active": tabId === "infoTab"})}
                                   onClick={this.handleTab}>Информация</a>
                                <a id="postsTab"
                                   className={classNames("navbar-tab", {"is-active": tabId === "postsTab"})}
                                   onClick={this.handleTab}>Публикации</a>
                            </div>
                            <div className="navbar-end">
                                {hasAuthority || isModerator ?
                                    <a className={classNames("config-button", {"is-active": isConfig})}
                                       onClick={this.toggleConfig}>
                                        <i className="far fa-cog fa-lg"/>
                                    </a> : null}
                            </div>
                        </div>
                    </div>
                </div>

                {isConfig && (hasAuthority || isModerator) ?
                    <ProfileConfig userSummary={userSummary}/> :
                    <div className="app-container">
                        {tabId === "infoTab" ?
                            <Fragment>
                                {hasInfo || isEditing ? renderInfo() : null}
                                {hasAuthority && !isEditing && !hasInfo ? renderInvite() : null}
                                {!hasAuthority && !hasInfo ? <NotFound message="Информация отсутствует"/> : null}
                            </Fragment> : null}
                        {tabId === "postsTab" ? renderPostList() : null}
                    </div>}
            </Fragment>
        );
        return null
    }
}

export default connect(
    state => ({
        inProcess: state.user.current.inProcess,
        isAuthenticated: state.user.current.accessToken !== null,
        isFetching: state.user.other.isFetching,
        updateFlag: state.user.current.updateFlag,
        current: state.user.current,
        other: state.user.other
    }),
    dispatch => ({
        setCurrentUserError: (value) => dispatch({type: "SET_CURRENT_USER_ERROR", value}),
        getUserSummaryByUserId: (userId, indicator) => dispatch(getUserSummaryByUserId(userId, indicator)),
        updateProfileById: (profileId, body, indicator) => dispatch(updateUserProfileById(profileId, body))
    })
) (Profile)
