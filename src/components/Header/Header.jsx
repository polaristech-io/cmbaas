import './Header.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  Nav, NavItem } from 'reactstrap';
//import { AppNavbarBrand } from '@coreui/react';
import styled from 'styled-components';

import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';

import ConnectionIndicator from './components/ConnectionIndicator';

const EosioLogoSmallSVG = ({className}) =>
	<svg t="1729042632538" class="icon" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4444" {...{className}} width="48px" height="48px">
		<path d="M105.48 361.972s90.482 119.466 190.184 198.984c0 0 37.774 32.07 78.19-4.394 40.41-36.464 207.33-188.452 207.33-188.452s62.804-62.372 133.098-0.438c0 0 147.596 131.34 228.406 241.588 0 0 4.834 3.956 0.876 10.982-3.952 7.032-11.856 26.36-11.856 26.36S842.986 531.96 740.628 447.18c0 0-39.968-30.302-74.232 1.756-34.27 32.074-196.778 180.536-222.696 199.426-25.926 18.89-68.528 38.528-129.146-15.376-47.24-41.982-170.948-158.994-219.62-232.8 0 0-4.394-3.956-0.876-11.852 4.23-9.546 11.422-26.362 11.422-26.362z" fill="#9cc813" p-id="4445"></path><path d="M123.984 325.86l51.572 56.906s6.492 8.298 18.584-2.184c12.094-10.484 171.294-165.046 231.972-208.466 34.754-24.874 72.052-40.97 113.664-43.812 31.046-2.098 64.394 1.12 100.308 17.23 38.854 17.452 98.032 65.378 153.672 122.942 39.268 40.64 78.3 85.722 111.198 129.36 22.238 29.486 43.492 59.178 59.714 85.124 0 0 0.4-35.904-15.782-66.28 0 0-64.902-124.406-191.82-241.39-12.372-11.412-120.562-119.772-225.65-117.402 0 0-97.972-5.542-187.204 67.828-14.72 12.11-171.318 147.132-220.228 200.144z" fill="#0080cb" p-id="4446"></path><path d="M235.154 445.764l58.69 56.71s13.486 10.314 28.96-4.366c0 0 56.312-55.114 104.564-99.292 45.508-41.666 91.296-84.428 108.408-96.616 0 0 73.77-76.53 167.762-1.99 0 0 127.706 100.338 253.816 272.266l4.15-20.232s4.76-16.938-6.538-32.414c0 0-98.534-145.436-219.94-249.996 0 0-60.482-63.938-137.816-79.922 0 0-63.944-15.132-124.44 32.386-29.728 23.358-94.366 83.548-148.206 134.806-50.012 47.618-89.41 88.66-89.41 88.66zM912.594 682.59l-51.572-56.906s-6.478-8.298-18.572 2.172c-12.108 10.494-171.294 165.046-231.986 208.48-34.746 24.87-72.038 40.966-113.656 43.798-31.046 2.126-64.386-1.11-100.3-17.23-38.868-17.452-98.04-65.364-153.686-122.942-39.268-40.64-78.3-85.708-111.198-129.35-22.238-29.498-43.5-59.174-59.7-85.12 0 0-0.408 35.904 15.766 66.276 0 0 64.896 124.396 191.822 241.38 12.372 11.424 120.57 119.782 225.656 117.402 0 0 97.964 5.554 187.196-67.816 14.72-12.118 171.318-147.14 220.23-200.144z" fill="#0080cb" p-id="4447"></path><path d="M801.416 562.69l-58.688-56.726s-13.486-10.298-28.96 4.37c0 0-56.306 55.128-104.544 99.292-45.508 41.666-91.302 84.428-108.408 96.63 0 0-73.778 76.53-167.77 1.976 0 0-127.7-100.338-253.816-272.266l-4.162 20.232s-4.76 16.962 6.546 32.414c0 0 98.528 145.446 219.932 250.01 0 0 60.482 63.948 137.83 79.934 0 0 63.952 15.108 124.446-32.414 29.728-23.356 94.346-83.544 148.192-134.802 50.01-47.608 89.402-88.65 89.402-88.65z" fill="#0080cb" p-id="4448"></path>
	</svg>

const StyledEosioLogoSmallSVG = styled(EosioLogoSmallSVG)`
  width: auto;
  height: 48px;
  display: block;
`;

const NavWrapper = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 0 0 10px;
  :nth-child(1){
    flex: 1.5 0 0;
  }
  :nth-child(2){
    flex: 5 0 0;
    .last-item{
      padding-right: 0 !important;
      flex: none;
    }
    @media screen and (max-width: 1280px){
      flex: 4 0 0;
    }
    @media screen and (max-width: 1120px){
      .last-item{
        flex: 0 1 0;
      }
    }

  }
  :nth-child(3){
    flex: 0.4 1 0;
    padding: 0;
    @media screen and (max-width: 1280px){
      flex: 0.1 1 0;
    }
  }
  :nth-child(4){
    flex: 3 0 0;
    .px-3{
      flex: none;
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1280px){
      flex: 2.7 0 0;
      .px-3{
        padding-right: 0 !important;
      }
    }
    @media screen and (max-width: 1120px){
      flex: 2 0 0;
      .px-3{
        flex: 0 1 0;
      }
    }

  }
  :nth-child(5){
    flex: 0.3 0 0;
    @media screen and (max-width: 1280px){
      padding: 0;
    }
  }
  :nth-child(6){
    flex: 0.6 0 0;
    padding: 0;
    .px-3{
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1120px){
      padding-right: 10px;
      .px-3{
        padding-right: 1rem !important;
      }
    }

  }
`

const NavWrapperRow = styled(NavWrapper)`
  flex-direction: row;
  justify-content: space-around;
`

const NavHead = styled.div`
  font-size: 9px;
  color: #bcbcbc;
  padding-top: 1px;
`

const VerticalLine = styled.div`
  height: 40px;
  width: 1px;
  margin: auto 0;
  background-color: #e8ebf0;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const AppName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 4px;
  line-height: 1;
  color:#443f54;
  font-weight: normal;
  height: 40px;
  font-weight: 500;
  text-align: left;
  >div{
    &:first-child{
      font-size: 11px;
      margin-top: 2.5px;
      sub{
        font-size: 25%;
      }
    }
    &:last-child{
      font-size: 16px;
      margin-bottom: 1.5px;
    }
  }
`

const WrappedLink = styled(Link)`
  display: flex;
  color: inherit;
  :hover{
    text-decoration: none;
    color: inherit;
  }
`
const NavStyled = styled(Nav)`
  padding-top: 10px;
`

const matchPath = (pathname, path) => {
  let splitArr = pathname.split("/");
  if(splitArr.find(el => el === path)){
    return true;
  }else{
    return false;
  }
}

const Header = (props) => {

  let { router: { location: {pathname} }, panelSelect } = props;

  return (
    <div className="Header">
        <NavWrapper>
          <WrappedLink to={`/`}>
            <Nav className="nav-items d-md-down-none" navbar>
              <LogoWrapper>
                <StyledEosioLogoSmallSVG/>
                <AppName>
                  <div>cmcc<sub>TM</sub></div>
                  <div>EOSIO Explorer</div>
                </AppName>
              </LogoWrapper>
            </Nav>
          </WrappedLink>
        </NavWrapper>
        <NavWrapper>
          <NavHead>检查</NavHead>
          <NavStyled className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to={`/`} className={`nav-link ${pathname === `/` ? `active` : ``}`}>信息</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/block-list`} className={`nav-link ${pathname === `/block-list` || pathname === `/block-list/` || matchPath(pathname, 'block') ? `active` : ``}`}>区块</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/transaction-list`} className={`nav-link ${pathname === `/transaction-list` || pathname === `/transaction-list/` || matchPath(pathname, 'transaction') ? `active` : ``}`}>交易</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/action-list`} className={`nav-link ${pathname === `/action-list` || pathname === `/action-list/` || matchPath(pathname, 'action') ? `active` : ``}`}>操作</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/account`} className={`nav-link ${pathname === `/account` || matchPath(pathname, 'account') ? `active` : ``}`}>账户</Link>
            </NavItem>
            <NavItem className="px-3 last-item">
              <Link to={`/contract`} className={`nav-link ${pathname === `/contract` || matchPath(pathname, 'contract') ? `active` : ``}`}>Smart协议</Link>
            </NavItem>
          </NavStyled>
        </NavWrapper>
        <NavWrapper></NavWrapper>
        <NavWrapper>
          <NavHead>互动交流</NavHead>
          <NavStyled className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link onClick={()=>panelSelect("permission-list")} to={`/permission`} className={`nav-link ${pathname === `/permission` || pathname === `/permission/` ? `active` : ``}`}>管理账户</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/deploy`} className={`nav-link ${pathname === `/deploy` || pathname === `/deploy/` ? `active` : ``}`}>部署协议</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/push-action`} className={`nav-link ${pathname === `/push-action` || pathname === `/push-action/` ? `active` : ``}`}>操作</Link>
            </NavItem>
          </NavStyled>
        </NavWrapper>
        <NavWrapperRow>
          <VerticalLine>&nbsp;</VerticalLine>
        </NavWrapperRow>
        <NavWrapperRow>
          <Nav className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <ConnectionIndicator/>
            </NavItem>
          </Nav>
        </NavWrapperRow>
        <div style={{display:"none"}}>
          <Link to={`/page-not-found`} ></Link>
        </div>
    </div>
  )
}

export default connect(
  ({router}) => ({
    router
  }),
  {
    panelSelect
  }

)(Header);
