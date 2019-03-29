import { commoonBR } from './module/common';
import { productCenterBR } from './module/productCenter';
import { operationBR } from './module/operation';
import { setSysBR } from './module/setSys';
import { userInfoBR } from './module/userInfo';
import { martDataBR } from './module/martData';



export default {
  home: 'Página inicial',
  ...commoonBR,
  ...productCenterBR,
  ...operationBR,
  ...setSysBR,
  ...userInfoBR,
  ...martDataBR,
}
