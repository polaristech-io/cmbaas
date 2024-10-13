import React, { Component } from 'react';
import {
  CardBody
} from 'reactstrap';
import { CardStyled } from 'styled';
import styled from 'styled-components';

const CardStyledNoBorder = styled(CardStyled)`
  border-top: solid 1px #e5e5e5;
`

const OrderedList = styled.ol`
  padding-left: 40px;
  counter-reset: my-counter;
  list-style: none;

  li {
    margin-top: 1.5rem;
    counter-increment: my-counter;
    position: relative;    
  }
  li:before {
    content: counter(my-counter)". ";    
    position: absolute;
    left: -30px;
  }
`
class InputInstructions extends Component {

  render() {
    return (
      <CardStyledNoBorder>
        <CardBody>
          <strong>入口点文件上传说明:</strong>
          <OrderedList>
            <li>
              将所选条目文件拖放到（或浏览）到灰色区域
            </li>
            <li>
              仔细检查您的源代码文件和依赖项
            </li>
            <li>
              <b>在指示的字段中输入包含此文件的绝对文件夹路径</b>
              "根文件夹路径". 该路径将保存在本地以供将来使用。该根文件夹中的所有文件
              将用作编译过程的一部分。
            </li>
            <li>
			  <b>可选步骤 2</b>：首先单击“生成 ABI”来生成 ABI 文件。
			  编译结果将出现在代码查看器中。查看 ABI/部署日志中是否有任何警告或错误。您还可以选择通过单击“导入 ABI”来导入 ABI 文件。
            </li>
            <li>
			  转到步骤 3，部署。如果您确定您的协议有效，则可以在选择要部署协议的权限后单击“部署”，将其部署到当前连接的 Nodeos 实例。 
			  <b>注意：您无法部署为“eosio”，因为“eosio”拥有系统协议。</b>
            </li>
          </OrderedList>
        </CardBody>
        <br />
      </CardStyledNoBorder>
    )
  }

}

export default InputInstructions;
