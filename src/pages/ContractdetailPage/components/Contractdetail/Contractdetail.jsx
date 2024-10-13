import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './ContractdetailReducer';
import MultiIndex from '../MultiIndex';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { Row, Col, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer, LoadingSpinner } from 'components';
import { CardStyled, CardHeaderStyled, ButtonPrimary, ErrorDivStyled, InputStyled} from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const SearchInputStyled = styled(InputStyled)`
  width: 38%;
  margin-right: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const DivHeaderStyled = styled.div`
  padding-bottom: 20px;
`

const DivMessageStyled = styled.div`
  font-weight: bold;
  padding-bottom: 20px;
`
const CustomErrorDiv = styled(ErrorDivStyled)`
  padding: 30px 0 0 0;
`

const Contractdetail = (props) => {

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    if(pathname === '/contract' || pathname === '/contract/'){
      setShowDetailsSection(false);
    }else{
      setShowDetailsSection(true)
      props.paramsSet({account_name:  pathNameConsumer(pathname) });
      props.fetchStart();  
    }       
  }, [])  
  
  let { contractdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Contractdetail">
      <Row> 
        <Col sm="12">
          <FirstCardStyled>
            <CardHeaderStyled>Search Smart Contract</CardHeaderStyled>
            <CardBody>
              <DivFlexStyled>
                <SearchInputStyled 
                      placeholder="Smart协议名称"
                      value={inputValue}
                      onKeyDown={
                        evt => {
                          if (evt.key === 'Enter') {
                            setInputValue("")
                            if(inputValue !== "")
                              props.push('/contract/'+inputValue)
                          }
                        }
                      }
                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                <ButtonPrimary                    
                      onClick={evt=> {
                        setInputValue("")
                        if(inputValue !== "")
                          props.push('/contract/'+inputValue)                         
                      }}>
                搜索</ButtonPrimary>
              </DivFlexStyled>
            </CardBody>
          </FirstCardStyled>
               
        </Col>                
      </Row>

      {showDetailsSection && 
        <div>
          {error
            ? <CustomErrorDiv>未找到Smart协议名称为 {params.account_name}的协议</CustomErrorDiv>
            : isFetching 
              ? <LoadingSpinner />
              : (Object.keys(payload).length !== 0 && payload.hasOwnProperty("abi") === true) 
                ? <div>
                    <Row> 
                      <Col sm="12">
                        <CardStyled>
                          <CardHeaderStyled>Smart协议详细</CardHeaderStyled>
                          <CardBody>
                            <DivHeaderStyled>Smart协议名称:&nbsp;{payload.account_name}</DivHeaderStyled>
                            <CodeViewer 
                              language="json"
                              value={JSON.stringify(payload.abi, null, 2)}
                              readOnly={true}
                              height={300}
                            />
                          </CardBody>
                        </CardStyled>
                      </Col>
                    </Row>  
                    
                    { payload.abi.tables.length === 0 
                      ? <DivMessageStyled>此协议不存在多个索引表</DivMessageStyled>
                      : <MultiIndex abiData={payload} />}
                  </div> 
            : <CustomErrorDiv>未找到Smart协议名称为 {params.account_name}的协议</CustomErrorDiv>           
          } 
        </div>    
      }
    </div>
  );
}

export default connect(
  ({ contractdetailPage: { contractdetail }, router}) => ({
    contractdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Contractdetail);
