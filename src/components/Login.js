import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import { List } from 'antd-mobile';
import { createForm } from 'rc-form';

import getData from '../utils/getData';

class Login extends Component {
  componentDidMount() {
    fetch('/api/logins', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: '{}'
    });

    this.keepAskingUntilQrcodeIsFetched();
  }

  keepAskingUntilQrcodeIsFetched() {
    this.qrCodeInterval = setInterval(() => {
      getData('/api/wechatQRCodes', res => {
        if (res.wechatQRCodes.length) {
          this.props.setQrcode(res.wechatQRCodes[0].imgUrl);
          this.keepAskingUntilAuthenticated();
          clearInterval(this.qrCodeInterval);
          this.qrCodeInterval = null;
        }
      });
    }, 1000);
  }

  keepAskingUntilAuthenticated() {
    this.authInterval = setInterval(() => {
      getData('/api/wechatQRCodes', (res) => {
        if(!res.wechatQRCodes.length) {
          this.props.onQrcodeScanned();
          clearInterval(this.authInterval);
          this.authInterval = null;
        }
      })
    }, 1000);
  }

  render() {
    const { qrcode } = this.props;
    return (
      <div style={{ display: 'flex', backgroundColor: 'white' }}>
        <List renderHeader={() => '请扫描微信二维码登录携程账号'} style={{ flex: 1 }}>
          <img src={qrcode} alt="loading..."/>
          <div style={{ color: 'orange' }}>如果您的携程账号尚未绑定微信,请自行绑定好再使用本应用.</div>
        </List>
      </div>
    );
  }
}

// <List renderHeader={() => '请输入12306的用户名密码以继续'} style={{ flex: 1 }}>
//   <InputItem
//     {...getFieldProps('username')}
//     clear
//     error={error}
//     placeholder="用户名/手机号"
//     autoFocus
//   />
//   <InputItem
//     {...getFieldProps('password')}
//     clear
//     placeholder="密码"
//     autoFocus
//     error={error}
//     type="password"
//   />
// </List>

export default compose(
  createForm(),
  withStateHandlers({
    authenticating: false,
    error: undefined,
    qrcode: undefined,
  }, {
    startAuth: () => () => ({ authenticating: true }),
    endAuth: () => () => ({ authenticating: false }),
    setError: () => (error) => ({ error }),
    setQrcode: () => qrcode => ({ qrcode }),
  }),
)(Login);
