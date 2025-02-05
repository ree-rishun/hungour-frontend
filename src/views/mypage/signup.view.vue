<template>
  <titleComponent
    title="予約情報入力" />
  <p
    class="plane_text">
    店舗予約の際に必要な情報を入力してください。
  </p>

  <sectionSubTitleComponent
    title="お名前（ひらがな）"/>
  <p
    class="plane_text">
    お店を予約する際に利用します。
  </p>
  <input
    type="text"
    placeholder="たなか たろう"
    v-model="userName">


  <sectionSubTitleComponent
    title="携帯電話番号"/>
  <p
    class="plane_text">
    予約したお店に共有する場合がございます。
  </p>
  <input
    type="tel"
    placeholder="09012341234"
    v-model="userTel">

  <div
    class="bottom_area">
    <buttonComponent
      text="登録する"
      :enable="userName !== '' && userTel !== ''"
      @clicked="submit" />
  </div>
</template>

<script
  setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import titleComponent from '@/components/shared/title.component.vue'
  import sectionSubTitleComponent from '@/components/shared/sectionSubTitle.component.vue'
  import buttonComponent from '@/components/shared/button.component.vue'
  import { activateUser } from '@/services/users.service.js'

  const router = useRouter()
  const userName = ref('')
  const userTel = ref('')

  const submit = async () => {
    await activateUser(
      userName.value,
      userTel.value,
    )

    router.push('/')
  }
</script>

<style
  scoped
  lang="scss">
  input[type=text], input[type=tel] {
    display: block;
    width: calc(100% - 16px);
    height: 48px;
    line-height: 48px;
    margin: 8px auto 0;
    padding: 0 8px;
    background: none;
    outline: none;
    border: solid 1px $color-light-gray;
    border-radius: 4px;
    color: #ffffff;
  }
  .plane_text {
    margin: 4px auto 0;
    font-weight: normal;
    font-size: $font-std;
    color: $color-light-gray;
  }
  .bottom_area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% - 32px);
    padding: 0 16px 16px;
  }
</style>