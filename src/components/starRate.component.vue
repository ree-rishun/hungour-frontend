<template>
  <div
    class="review_star"
    :style="'line-height: ' + props.imageSize + 'px'">
    <span
      v-for="n of 5"
      class="star_icon"
      :style="'line-height: ' + props.imageSize + 'px'"
      :key="n">
      <img
        v-if="n <= props.score"
        alt="star"
        :height="props.imageSize + 'px'"
        src="@/assets/img/icon/star_fine.svg"/>
      <span
        v-else
        class="flame_star"
        :id="n"
        :style="'height: ' + props.imageSize + 'px;'">
        <img
          alt="star"
          :height="props.imageSize + 'px;'"
          src="@/assets/img/icon/star_flame.svg" />
        <img
          alt="star_fine"
          class="background_fine_star"
          :style="
            'width: ' + (props.imageSize * (props.score - (n - 1))) + 'px;'
            + 'top: ' + (23 - props.imageSize) + ';'
            + 'height: ' + props.imageSize + 'px;'
            + (n > props.score + 1 ? ' display: none;' : '')"
          src="@/assets/img/icon/star_fine.svg"/>
      </span>
    </span>
  </div>
</template>

<script
  setup>
  const props = defineProps({
    score: {
      type: String,
      required: true,
    },
    imageSize: {
      type: Number,
      required: false,
      default: 32,
    }
  })
</script>

<style
  scoped
  lang="scss">
  .review_star {
    display: inline-block;
    text-align: left;
    line-height: 30px;
    font-size: 20px;
    .star_icon {
      vertical-align: top;
      margin: 0 1.5px;
      .flame_star {
        position: relative;
        img {
          width: auto;
        }
        .background_fine_star {
          position: absolute;
          left: 0;
          padding: 0;
          margin: 0;
          display: inline-block;
          object-fit: cover;
          object-position: 0 100%;
          vertical-align: top;
        }
      }
    }
  }
</style>