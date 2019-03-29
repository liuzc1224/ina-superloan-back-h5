<template>
  <div>
    <Form ref="usersearch" inline>
      <Row>
        <Col span="3">
          <FormItem style="width:100%;">
            <Select v-model="searchLabel" clearable ref="status">
              <Option
                v-for="(item,index) in searchList"
                :value="item.value"
                :key="index"
                :placeholder="searchList[0].label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4" offset="1">
          <FormItem style="width:100%;">
            <Input
              :placeholder="$t('userList.inputPlaceHolder')"
              class="search-input"
              v-model="searchValue"
            />
          </FormItem>
        </Col>
        <Col span="5" offset="1">
          <FormItem :label="$t('userList.registerTime')" :label-width="60">
            <DatePicker
              type="date"
              ref="createTimeStart"
              :placeholder="$t('accountList.timeStart')"
              v-model="searchForm.createTimeStart"
              style="width:100%;"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="1" style="text-align: center">~</Col>
        <Col span="4">
          <FormItem>
            <DatePicker
              type="date"
              ref="createTimeEnd"
              :placeholder="$t('accountList.timeEnd')"
              v-model="searchForm.createTimeEnd"
            ></DatePicker>
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
import { formatDate } from "@/assets/js/date";
export default {
  name: "tablesearch",
  data() {
    return {
      searchLabel: "phoneNumber",
      searchValue: null,
      searchList: [
        {
          value: "phoneNumber",
          label: this.$t("userList.phoneNumber")
        }
      ],
      searchForm: {
        createTimeStart: null,
        createTimeEnd: null
      }
    };
  },
  created() {},
  methods: {
    handleSubmit() {
        let data = {
            [this.searchLabel]: this.searchValue,
            "createTimeStart": this.searchForm.createTimeStart && formatDate(new Date(this.searchForm.createTimeStart), "yyyy-MM-dd hh:mm:ss"),
            "createTimeEnd": this.searchForm.createTimeEnd && formatDate(new Date(this.searchForm.createTimeEnd), "yyyy-MM-dd") + ' 23:59:59',
        };
        if (!this.searchValue) {
          delete data[this.searchLabel]
        }
        this.$emit("tableSearch", data);
    },
    handleReset() {
      this.searchValue = null;
      // this.$refs.status.clearSingleSelect();
      this.$refs.createTimeStart.handleClear();
      this.$refs.createTimeEnd.handleClear();
      this.$emit("reset");
    }
  }
};
</script>
