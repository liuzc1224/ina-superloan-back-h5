<template>
  <div>
    <Form ref="usersearch">
      <Row>
        <Col span="14">
          <Col span="24">
            <FormItem label="日期选择">
              <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.createTimeStart"></DatePicker>
              　-　
              <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.createTimeEnd"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="合作方式" prop="cooperation">
              <Select v-model="searchForm.cooperation" style="width:70%;max-width:200px">
                <Option value="cpi" key="cpi">CPI</Option>
                <Option value="cps" key="cps">CPS</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="负责人" prop="principal">
              <Input v-model="searchForm.principal" placeholder="请输入负责人" style="width:70%;max-width:200px"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="渠道ID　" prop="channelId">
              <Input v-model="searchForm.channelId" placeholder="请输入渠道ID" style="width:70%;max-width:200px"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem>
              <Button type="primary" @click="handleSubmit">{{$t('userList.search')}}</Button>
              <Button @click="handleReset" style="margin-left:10px">{{$t('userList.reset')}}</Button>
            </FormItem>
          </Col>
          <Col span="24">
            <Button type="primary" icon="ios-add" @click="editModal = true">新增导入</Button>
          </Col>
        </Col>
        <Col span="10">
          <c-chart :conf="chartsConf"></c-chart>
        </Col>
      </Row>
    </Form>
    <Modal v-model="editModal" width="360">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>新增导入</span>
      </p>
      <div>
        <Row>
          <Col span="24">
            <Upload
              ref="uploadFile"
              with-credentials
              :action="`${baseUrl}/cashloanoper/import`"
              :on-format-error="handleFormatError"
              :on-success="handleSuccess"
            >
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <div>
          <Button :size="'large'" :loading="modal_loading" type="primary" @click="close">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { formatDate } from "@/assets/js/date";
import CChart from "@/components/charts/commonChart";
import config from "@/config";
import { getOperateReportMap } from "@/api/loanReport";
import { formatyAxis } from "@/libs/util";
export default {
  name: "tablesearch",
  components: {
    CChart
  },
  data() {
    return {
      chartsConf: null,
      editModal: false,
      modal_loading: false,
      searchForm: {
        createTimeStart: '',
        createTimeEnd: '',
        cooperation: '',
        principal: '',
        channelId: ''
      },
    };
  },
  created() {
    this.getCharts();
    this.baseUrl;
    if (process.env.NODE_ENV === "onlinetest") {
      this.baseUrl = config.baseUrl.online + "";
    } else if (process.env.NODE_ENV === "production") {
      this.baseUrl = config.baseUrl.pro;
    } else {
      this.baseUrl = config.baseUrl.dev;
    }
  },
  methods: {
    getCharts() {
      let param = {
        rate: 6.5,
        createTimeStart: '',
        createTimeEnd: '',
        cooperation: this.searchForm.cooperation,
        principal: this.searchForm.principal,
        channelId: this.searchForm.channelId
      }
      if ( this.searchForm.createTimeStart && this.searchForm.createTimeStart.getDate ) {
        param.createTimeStart = formatDate (this.searchForm.createTimeStart, 'yyyy-MM-dd') + ' 00:00:00'
      }
      if ( this.searchForm.createTimeEnd && this.searchForm.createTimeEnd.getDate ) {
        param.createTimeEnd = formatDate (this.searchForm.createTimeEnd, 'yyyy-MM-dd') + ' 23:59:59'
      }
      for ( let p in param ) {
        if ( param[p] == '' ) {
          delete param[p];
        }
      }
      getOperateReportMap("operate_report", param)
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj["xAxis"] = obj.xaxis;
              obj["yAxis"] = formatyAxis(obj.yaxis);
              this.chartsConf = obj;
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSubmit() {
      this.getCharts();
      this.$emit("tableSearch",this.searchForm);
    },
    handleReset() {
      this.searchForm.createTimeStart = ''
      this.searchForm.createTimeEnd = ''
      this.searchForm.cooperation = '',
      this.searchForm.principal = '',
      this.searchForm.channelId = ''
      this.getCharts();
      this.$emit("reset");
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传文件类型错误",
        desc: "上传文件:" + file.name + "请选择.xls"
      });
    },
    handleSuccess(res, file) {
      if (res.success) {
        this.$Message.success('上传成功')
      } else {
        this.$Message.error(res.message);
      }
    },
    clearUploadList() {
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.clearFiles();
      }
    },
    close() {
      this.editModal = false;
      this.$emit("tableSearch");
    },
  }
};
</script>
