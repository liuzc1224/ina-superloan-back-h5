import { commoonCN } from './module/common';
import { productCenterCN } from './module/productCenter';
import { operationCN } from './module/operation';
import { setSysCN } from './module/setSys';
import { userInfoCN } from './module/userInfo';
import { martDataCN } from './module/martData';



export default {
  home: '首页',
  ...commoonCN,
  ...productCenterCN,
  ...operationCN,
  ...setSysCN,
  ...userInfoCN,
  ...martDataCN,
}
