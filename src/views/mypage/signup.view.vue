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
  <button
    @click="sendOtp">
    認証コードを送信
  </button>

  <input
    type="text" />
  <button
    >
    認証
  </button>
  <div id="recaptcha-container"></div>

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
  import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
  import { initializeApp } from 'firebase/app'
  import { firebaseConfig } from '@/config/firebase-config.js'

  const router = useRouter()
  const userName = ref('')
  const userTel = ref('')
  const otpCode = ref('')
  const confirmationResult = ref(null)

  const submit = async () => {
    await activateUser(
      userName.value,
      userTel.value,
    )

    router.push('/')
  }
  const sendOtp = async () => {
    const a = await initializeApp(firebaseConfig)
    const auth = await getAuth(a)
    console.log(auth)
    console.log(formatPhoneNumber(userTel.value))
    await auth.useDeviceLanguage()
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container', {
      size: 'invisible',
      callback: () => console.log('reCAPTCHA solved')
    })
    try {
      confirmationResult.value = await signInWithPhoneNumber(
        auth,
        formatPhoneNumber(userTel.value),
        window.recaptchaVerifier
      )
      alert('SMSを送信しました')
    } catch (error) {
      console.error('SMS送信エラー:', error)
      alert('SMS送信に失敗しました')
    }
  }

  const verifyOtp = async () => {
    if (!confirmationResult.value) {
      alert('まずSMSを送信してください')
      return
    }

    try {
      const userCredential = await confirmationResult.value.confirm(otpCode.value)
      console.log('認証成功:', userCredential.user)
      alert('電話番号認証成功')
    } catch (error) {
      console.error('認証エラー:', error)
      alert('認証コードが間違っています')
    }
  }

  function formatPhoneNumber(phoneNumber) {
    return phoneNumber.startsWith('0') ? '+81' + phoneNumber.slice(1) : phoneNumber
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