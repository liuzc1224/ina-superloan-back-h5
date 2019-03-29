<template>
  <div>
    <Card style="margin-bottom:10px">
      <table-search @tableSearch="search" @reset="reset"></table-search>
    </Card>
    <Card>
      <Row style="margin-bottom:20px;">
        <Col span="3">
          <Button
            type="primary"
            icon="ios-add"
            @click="showModule({name:'editModal',data:null,type:'1',title:'单个新增'})"
          >单个新增</Button>
        </Col>
        <Col span="3">
          <Button
            type="primary"
            icon="ios-add"
            @click="showModule({name:'editModal',data:null,type:'2',title:'批量新增'})"
          >批量新增</Button>
        </Col>
        <Col span="3">
          <Button type="primary" icon="ios-cloud-download" @click="getDownloadUrl('demo')">下载模版</Button>
          <!--<Button type="primary" icon="ios-cloud-download" @click="getDownloadUrl()">导出</Button>-->
        </Col>
      </Row>
      <Table stripe :columns="columns" :data="tableData" :loading="loading"></Table>
      <div style="margin:10px;overflow: hidden;">
        <div class="flex-center">
          <Page
            :total="searchModal.totalNumber"
            :current="1"
            @on-change="changePage"
            show-elevator
            show-total
          ></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>{{modalOption.title}}</span>
      </p>
      <div style="text-align:center">
        <p>{{`是否删除 ${ strxx }`}}</p>
      </div>
      <div slot="footer">
        <div>
          <Button :size="'large'" type="default" @click="close">取消</Button>
          <Button
            :size="'large'"
            :loading="modal_loading"
            type="primary"
            @click="del(modalOption.data && modalOption.data.id)"
          >确定</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="editModal" width="360">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>{{modalOption.title}}</span>
      </p>
      <div v-if="!isEditAll">
        <Form ref="editForm" :model="editForm" :rules="ruleValidate" inline>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.phoneNumber')"
                :label-width="100"
                prop="phoneNumber"
                style="width:100%;"
              >
                <Input
                  ref="phoneNumberInp"
                  :placeholder="$t('userList.inputPlaceHolder')"
                  class="search-input"
                  v-model="editForm.phoneNumber"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.identityCard')"
                :label-width="100"
                prop="identityCard"
                style="width:100%;"
              >
                <Input
                  ref="identityCard"
                  :placeholder="$t('userList.inputPlaceHolder')"
                  class="search-input"
                  v-model="editForm.identityCard"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.companyName')"
                :label-width="100"
                prop="companyName"
                style="width:100%;"
              >
                <Input
                  ref="identityCard"
                  :placeholder="$t('userList.inputPlaceHolder')"
                  class="search-input"
                  v-model="editForm.companyName"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.listType')"
                :label-width="100"
                prop="listType"
                style="width:100%;"
              >
                <Select v-model="editForm.listType" clearable ref="inpType">
                  <Option
                    v-for="(item,index) in searchTypeList"
                    :value="item.value"
                    :key="index"
                    :placeholder="searchTypeList[0].label"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.listAttribution')"
                :label-width="100"
                style="width:100%;"
                prop="listBelong"
              >
                <Select v-model="editForm.listBelong" clearable ref="inpAttr">
                  <Option
                    v-for="(item,index) in searchAttributionList"
                    :value="item.value"
                    :key="index"
                    :placeholder="searchAttributionList[0].label"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                :label="$t('userList.remarks')"
                :label-width="100"
                style="width:100%;"
              >
                <Input
                  ref="identityCard"
                  :placeholder="$t('userList.inputRemarks')"
                  class="search-input"
                  v-model="editForm.remarks"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div v-else>
        <Row>
          <Col span="6">
            <span>批量导入</span>
          </Col>
          <Col span="8">
            <Upload
              ref="uploadFile"
              with-credentials
              :action="`${baseUrl}/blackandwhite/import`"
              :on-format-error="handleFormatError"
              :on-success="handleSuccess"
            >
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
              {{uploadCount ? `已导入${uploadCount}条` : null}}
            </Upload>
          </Col>
          <!--<Col span="4">-->
            <!--<Button type="primary" icon="ios-cloud-download" @click="getDownloadUrl('demo')">下载模版</Button>-->
          <!--</Col>-->
        </Row>
      </div>
      <div slot="footer">
        <div>
          <!--<Button :size="'large'" type="default" @click="close">取消</Button>-->
          <Button
            v-if="!isEditAll"
            :size="'large'"
            :loading="modal_loading"
            type="primary"
            @click="submit(modalOption.type === '3'? modalOption.data.id : 'addBlackandWhiteList' )"
          >确定</Button>
          <Button v-else :size="'large'" :loading="modal_loading" type="primary" @click="close">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import TableSearch from "./search";
import {
  getBlackandWhiteList,
  addBlackandWhiteList,
  deleteBlackandWhiteList,
  putBlackandWhiteList
} from "@/api/user";
import { formatDate } from "@/assets/js/date";
import config from "@/config";
import { SearchModal } from "./search.modal";
export default {
  name: "user-list",
  components: {
    TableSearch
  },
  data() {
    return {
      delModal: false,
      editModal: false,
      isEditAll: false,
      modal_loading: false,
      uploadCount: null,
      strxx: "",
      modalOption: {
        name: "",
        data: null,
        type: "",
        title: ""
      },
      editForm: {
        identityCard: null,
        companyName: null,
        phoneNumber: null,
        listType: null,
        listBelong: null,
        remarks: null
      },
      searchTypeList: [
        {
          value: "0",
          label: this.$t("userList.blackType")
        },
        {
          value: "1",
          label: this.$t("userList.whiteType")
        },
        {
          value: "4",
          label: this.$t("userList.overdue")
        },
        {
          value: "2",
          label: this.$t("userList.laidOut")
        },
        {
          value: "5",
          label: this.$t("userList.loanOverdue")
        },
        {
          value: "6",
          label: this.$t("userList.machineReview")
        },
        {
          value: "7",
          label: this.$t("userList.initialReview")
        },
        {
          value: "3",
          label: this.$t("userList.finalReview")
        },
        {
          value: "8",
          label: this.$t("userList.other")
        }
      ],
      searchAttributionList: [
        {
          value: "0",
          label: this.$t("userList.proMart")
        },
        {
          value: "1",
          label: "mytunai"
        },
        {
          value: "2",
          label: "danaring"
        },
        {
          value: "9",
            label: this.$t("userList.other")
        }
      ],
      loading: true,
      tableData: [],
      searchModal: new SearchModal(),
      columns: [
        { title: this.$t("userList.userNo"), type: "index", align: "center" },
        {
          title: this.$t("userList.phoneNumber"),
          key: "phoneNumber",
          align: "center"
        },
        {
          title: this.$t("userList.identityCard"),
          key: "identityCard",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("userList.companyName"),
          key: "companyName",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("userList.listType"),
          key: "listType",
          align: "center",
          render: function(h, params) {
            let str;
            if (this.row.listType === 0) {
              str = "黑名单";
            }
            if (this.row.listType === 1) {
              str = "白名单";
            }
            if (this.row.listType === 2) {
              str = "已放款-首借";
            }
            if (this.row.listType === 3) {
              str = "终审拒件";
            }
            if (this.row.listType === 4) {
              str = "逾期";
            }
            if (this.row.listType === 5) {
              str = "已放款-复借逾期";
            }
            if (this.row.listType === 6) {
              str = "机审拒件";
            }
            if (this.row.listType === 7) {
              str = "初审拒件";
            }
            if (this.row.listType === 8) {
              str = "其他";
            }
            return h("div", str);
          }
        },
        {
          title: this.$t("userList.listAttribution"),
          key: "listBelong",
          align: "center",
          render: function(h, params) {
            let str;
            if (this.row.listBelong === 0) {
              str = "贷超渠道";
            }
            if (this.row.listBelong === 1) {
              str = "mytunai";
            }
            if (this.row.listBelong === 2) {
              str = "danaring";
            }
            if (this.row.listBelong === 9) {
              str = "其他";
            }
            return h("div", str);
          }
        },
        {
          title: this.$t("userList.remarks"),
          key: "remarks",
          align: "center"
        },
        {
          title: this.$t("userList.modifyTime"),
          key: "modifyTime",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              formatDate(new Date(this.row.modifyTime), "yyyy-MM-dd  hh:mm:ss")
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {},
                  style: {
                    color: "#57a3f3",
                    cursor: "pointer",
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      let data = {
                        name: "editModal",
                        data: params.row,
                        type: "3",
                        title: this.$t("com-edit")
                      };
                      this.showModule(data);
                    }
                  }
                },
                this.$t("com-edit")
              ),
              h(
                "span",
                {
                  props: {},
                  style: {
                    color: "#57a3f3",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      let data = {
                        name: "delModal",
                        data: params.row,
                        type: "4",
                        title: this.$t("com-delete")
                      };
                      this.showModule(data);
                    }
                  }
                },
                this.$t("com-delete")
              )
            ]);
          }
        }
      ],
      ruleValidate: {
        phoneNumber: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        listType: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        identityCard: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        listBelong: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.search();
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
    changePage(page) {
      this.searchModal.currentPage = page;
      this.getList();
    },
    getList() {
      getBlackandWhiteList(this.searchModal)
        .then(res => {
          this.loading = false;
          if (res && res.data.success) {
            this.tableData = res.data.data;
            if (res.data.page) {
              this.searchModal.totalNumber = res.data.page.totalNumber;
              this.searchModal.currentPage = res.data.page.currentPage;
            } else {
              this.searchModal.totalNumber = 1;
              this.searchModal.currentPage = 1;
            }
          } else {
            this.$Message.error(this.$t("error") + res.data.message);
          }
        })
        .catch(err => {});
    },
    search(data) {
      Object.assign(this.searchModal, data);
      this.getList();
    },
    reset() {
      this.searchModal = new SearchModal();
      this.getList();
    },
    del(id) {
      this.modal_loading = true;
      deleteBlackandWhiteList(id)
        .then(res => {
          this.modal_loading = false;
          if (res.data && res.data.success) {
            this.delModal = false;
            this.getList();
          } else {
            this.$Message.success(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.delModal = false;
    },
    submit(type) {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          this.$Message.error("请输入每一项内容!");
          return false;
        } else {
          this.modal_loading = true;
          if (type === "addBlackandWhiteList") {
            addBlackandWhiteList(this.editForm)
              .then(res => {
                this.modal_loading = false;
                if (res.data && res.data.success) {
                  this.editModal = false;
                  this.getList();
                } else {
                  this.$Message.success(res.data.message);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.editForm.id = type;
            putBlackandWhiteList(this.editForm)
              .then(res => {
                this.modal_loading = false;
                if (res.data && res.data.success) {
                  this.editModal = false;
                  this.getList();
                } else {
                  this.$Message.success(res.data.message);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    },
    getDownloadUrl(demo) {
      if (demo === "demo") {
        window.location.href = `http://back.51fastloan.com/file/blackwhite.xlsx`;
        return false;
      }
      let str = "";
      Object.keys(this.searchModal).forEach(key => {
        if (this.searchModal[key]) {
          str += `${key}=${this.searchModal[key]}&`;
        }
      });
      str = str.slice(1, str.length - 1);
      window.location.href = `${this.baseUrl}/blackandwhite/export?${str}`;
    },
    close() {
      this.delModal = false;
      this.editModal = false;
      this.getList();
    },
    showModule(params) {
      // this.$refs.editForm && this.$refs.editForm.resetFields();
      this.editForm.phoneNumber = null;
      this.editForm.identityCard = null;
      this.editForm.companyName =null;
      this.editForm.listType = null;
      this.editForm.listBelong = null;
      this.editForm.remarks = null;
      this.uploadCount = null;
      this.clearUploadList();
      Object.assign(this.modalOption, params);
      if (params.type === "2") {
        this.isEditAll = true;
      } else if (params.type === "3") {
        this.editForm.phoneNumber = params.data.phoneNumber + "";

        this.editForm.identityCard = params.data.identityCard + "";
        this.editForm.companyName = params.data.companyName + "";

        this.editForm.listType = params.data.listType + "";
        this.editForm.listBelong = params.data.listBelong + "";
        this.editForm.remarks = params.data.remarks ?  params.data.remarks+ "" : "";
        // this.$refs.phoneNumberInp.disabled = true;
        this.isEditAll = false;
      } else {
        let name;
        if(params.data && params.data.listType){
          name=this.searchTypeList.filter(item=>{
            return item.value==params.data.listType;
          });
        }
        let type;
        if(params.data && params.data.listBelong){
          type=this.searchAttributionList.filter(item=>{
            return item.value==params.data.listBelong;
          });
        }
        let st1=name && name[0]["label"] ? name[0]["label"] : "";
        let st2=type && type[0]["label"] ? type[0]["label"] : "";
        this.strxx=  st1+"              "+st2 ;
        this.isEditAll = false;
        // this.$refs.phoneNumberInp.disabled = false;
      }
      this[params.name] = true;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传文件类型错误",
        desc: "上传文件:" + file.name + "请选择.xls"
      });
    },
    handleSuccess(res, file) {
      if (res.success) {
        this.uploadCount = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    clearUploadList() {
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.clearFiles();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

