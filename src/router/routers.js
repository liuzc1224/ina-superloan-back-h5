import homeRouter from './homeRouter';
import operationRouter from './operationRouter';
import setSysRouter from './setSysRouter';
import userInfoRouter from './userInfoRouter';
import loanReportRouter from './loanReportRouter';
import martDataRouter from './martDataRouter';

export default [
  ...homeRouter,
  ...operationRouter,
  ...userInfoRouter,
  ...setSysRouter,
  ...loanReportRouter,
  ...martDataRouter
]
