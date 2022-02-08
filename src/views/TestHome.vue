<template>
  <div>
    <b-card title="Array" style="max-width: 20rem" class="mb-2">
      <b-card-text>
        {{ demos }}
        <hr />
      </b-card-text>
      <b-button variant="danger" @click="demoPop">pop</b-button>
      <b-button variant="success" @click="demoPush">Push</b-button>
    </b-card>
    <!-- 只要template有東西更新，方法就會重新執行 -->
    <p>{{ desc }} : {{ descLength }} : {{ getDescLength() }}</p>
  </div>
</template>

<script>
export default {
  props: {
    theProps: {
      type: Array,
      default() {
        // (不管有沒有被 template 引用) it execute in `beforeCreate` -> `created`
        console.log('props default');
        return ['a', 'b', 'c'];
      }
    }
  },
  data() {
    return {
      demos: [1, 2, 3, 4, 5, 6, 7, 8],
      desc: 'That is a great idea!'
    };
  },
  computed: {
    demoLength() {
      console.log('computed demoLength');
      if (!this.demos) return 0;
      return this.demos.length;
    },
    demoLengthDouble() {
      console.log('computed demoLengthDouble');
      if (!this.demos) return 0;
      return this.demoLength * 2;
    },
    descLength() {
      console.log('computed descLength');
      return this.desc.length;
    }
  },
  // watch: https://cn.vuejs.org/v2/api/#watch
  watch: {
    desc(newValue, oldValue) {
      let a = newValue.length;
      let b = oldValue.length;
      console.log('watch desc: ', a, b);
    },
    demoLength: {
      // demoLength 為 computed，因為被 watch 偵聽，所以在 `beforeCreate` -> `created` 中間會先執行(不管有沒有被 template 引用)
      // computed 如果沒有被偵聽，在在 `beforeMount` -> `mounted` 中間才會執行(render function)
      handler(newValue, oldValue) {
        console.log('watch demoLength: ', newValue, oldValue);
      },
      immediate: true // immediate 讓 `beforeCreate` -> `created` 中間時就觸發這個 watch 一次
    }
    // demoLengthDouble: {
    //   handler(newValue, oldValue) {
    //     console.log('watch demoLengthDouble: ', newValue, oldValue);
    //   }
    // }
  },
  beforeCreate() {
    console.log('beforeCreate', this.theProps);
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
    console.log('=======');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  updated() {
    console.log('updated');
  },
  methods: {
    demoPop() {
      this.demos.pop();
    },
    demoPush() {
      this.demos.push(1);
    },
    getDescLength() {
      // 如果是用 method 在 template 顯示資料，
      // 只要畫面被 re-render (其他地方的資料更新)
      // method 就會被強迫觸發，不管這裡的東西有沒有變
      console.log('getDescLength==');
      return this.desc.length;
    }
  }
};
</script>

<style lang="scss" scoped></style>
