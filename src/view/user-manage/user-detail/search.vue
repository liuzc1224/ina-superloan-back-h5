<template>
  <div>
    <Form ref="usersearch" inline>
      <Row>
        <Col span="4">
          <FormItem :label="$t('userList.phoneNumber')" :label-width="60" style="width:100%;">
            <Input
              :placeholder="$t('userList.inputPlaceHolder')"
              class="search-input"
              v-model="searchPhome"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="$t('userList.identityCard')" :label-width="80" style="width:100%;">
            <Input
              :placeholder="$t('userList.inputPlaceHolder')"
              class="search-input"
              v-model="identityCard"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="$t('userList.companyName')" :label-width="80" style="width:100%;">
            <Input
              :placeholder="$t('userList.inputPlaceHolder')"
              class="search-input"
              v-model="companyName"
            />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="$t('userList.listType')" :label-width="80" style="width:100%;">
            <Select v-model="searchTypeValue" clearable ref="inpType">
              <Option
                v-for="(item,index) in searchTypeList"
                :value="item.value"
                :key="index"
                :placeholder="searchTypeList[0].label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="$t('userList.listAttribution')" :label-width="80" style="width:100%;">
            <Select v-model="searchAttributionValue" clearable ref="inpAttr">
              <Option
                v-for="(item,index) in searchAttributionList"
                :value="item.value"
                :key="index"
                :placeholder="searchAttributionList[0].label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="$t('userList.remarks')" :label-width="80" style="width:100%;">
            <Input
              :placeholder="$t('userList.inputRemarks')"
              class="search-input"
              v-model="remarks"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit">{{$t('userList.search')}}</Button>
          <Button @click="handleReset" style="margin-left:10px">{{$t('userList.reset')}}</Button>
        </FormItem>
      </Row>
    </Form>
  </div>
</template>
<script>
export default {
  name: "tablesearch",
  data() {
    return {
      searchTypeValue: "",
      searchAttributionValue: "",
      searchPhome: "",
      remarks:"",
      identityCard:"",
      companyName:"",
      searchTypeList: [
        {
          value: 0,
          label: this.$t("userList.blackType")
        },
        {
          value: 1,
          label: this.$t("userList.whiteType")
        },
        {
          value: 4,
          label: this.$t("userList.overdue")
        },
        {
          value: 2,
          label: this.$t("userList.laidOut")
        },
        {
          value: 5,
          label: this.$t("userList.loanOverdue")
        },
        {
          value: 6,
          label: this.$t("userList.machineReview")
        },
        {
          value: 7,
          label: this.$t("userList.initialReview")
        },
        {
          value: 3,
          label: this.$t("userList.finalReview")
        },
        {
          value: 8,
          label: this.$t("userList.other")
        }
      ],
      searchAttributionList: [
        {
          value: 0,
          label: this.$t("userList.proMart")
        },
        {
          value: 1,
          label: "mytunai"
        },
        {
          value: 2,
          label: "danaring"
        }
      ]
    };
  },
  created() {},
  methods: {
    handleSubmit() {
      let data = {
        'phoneNumber': this.searchPhome || null,
        'identityCard':this.identityCard || null,
        'companyName':this.companyName || null,
        'listType': (typeof this.searchTypeValue).toLowerCase() === 'number' ? this.searchTypeValue : null,
        'listBelong': (typeof this.searchAttributionValue).toLowerCase() === 'number' ? this.searchAttributionValue : null,
        'remarks':this.remarks || null,
      };
      console.log(this.searchTypeValue);
      console.log(data);
      this.$emit("tableSearch", data);
    },
    handleReset() {
      this.searchPhome = "";
      this.identityCard = "";
      this.companyName = "";
      this.remarks="";
      this.$refs.inpType.clearSingleSelect();
      this.$refs.inpAttr.clearSingleSelect();
      this.$emit("reset");
    }
  }
};
</script>
