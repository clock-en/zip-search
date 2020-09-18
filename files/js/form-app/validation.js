/**
 * validation.js
 * @fileoverview バリデーションクラスを管理
 */

/**
 * formApp
 * @namespace
 */
var formApp = formApp || {};

(function () {
  'use strict';

  /**
   * @class バリデーションクラス
   * @memberOf formApp
   */
  class Validation {
    constructor(formId, formModel) {
      this.form = document.getElementById(formId);
      this.messages = {
        notBlank: 'をご入力ください。',
        isSingle: 'は半角でご入力ください。',
        isZip: '形式でご入力ください。',
      };
      this.formModel = formModel;
      this.patterns = {
        alphabetsPattern: 'a-zA-Z',
        multiAlphabetsPattern: 'ａ-ｚＡ-Ｚ',
        numbersPattern: '0-9',
        multiNumbersPattern: '０-９',
        symbolsPattern:
          '"' +
          "!#\\$%&'\\(\\)\\*\\+,\\-\\.\\\\/:;<=>\\?@\\[\\]\\^_`\\{\\|\\}！＃＄％＆（）＊＋，－．／：；＜＝＞？＠［］＾＿｀｛｜｝~ 　",
      };
      this.results = {};
    }

    /**
     * バリデーションの初期化処理を実行
     *
     * @returns {void}
     */
    initialize() {
      Object.keys(this.formModel).forEach((id) => {
        this.results[id] = this.validate(id);
        this.setInputsEvent(id);
      });
      this.setSubmitState();
    }

    /**
     * バリデートを実行
     *
     * @param {string} id
     * @returns {string}
     */
    validate(id) {
      const model = this.formModel[id];
      const element = document.getElementById(id);
      const value = element.value;
      let result = 'valid';
      model.rules.some((rule) => {
        if (!this[rule](value)) {
          result = rule;
          return true;
        }
      });

      return result;
    }

    /**
     * 入力項目にイベントリスナーを設定
     *
     * @param {string} id
     * @returns {void}
     */
    setInputsEvent(id) {
      const element = document.getElementById(id);
      element.addEventListener('input', (e) => {
        this.results[id] = this.validate(id);
        this.renderErrorMessage(id);
        this.setSubmitState();
      });
    }

    /**
     * エラーメッセージの描画を管理
     *
     * @param {string} id
     * @returns {void}
     */
    renderErrorMessage(id) {
      if (this.results[id] === 'valid') {
        this.hideErrorMessage(id);
      } else {
        this.showErrorMessage(id);
      }
    }

    /**
     * エラーメッセージを非表示
     *
     * @param {string} id
     * @returns {void}
     */
    hideErrorMessage(id) {
      const errorElement = document.querySelector(
        `[data-error-message="${id}"]`
      );
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    /**
     * エラーメッセージを表示
     *
     * @param {string} id
     * @returns {void}
     */
    showErrorMessage(id) {
      const errorElement = document.querySelector(
        `[data-error-message="${id}"]`
      );
      const errorRule = this.results[id];
      if (errorElement) {
        errorElement.textContent =
          this.formModel[id].label + this.messages[errorRule];
        errorElement.style.display = 'block';
      }
    }

    /**
     * 送信ボタンの状態を設定
     *
     * @returns {void}
     */
    setSubmitState() {
      const elements = this.form.querySelectorAll('[type="submit"]');
      const result = Object.keys(this.results).every((id) => {
        return this.results[id] === 'valid';
      });

      elements.forEach((element) => {
        element.disabled = !result;
      });
    }

    /**
     * バリデーション：必須チェック
     *
     * @param {string} value
     * @returns {boolean}
     */
    notBlank(value) {
      let result = true;

      /* 値が空の場合は結果をfalseに設定 */
      if (value === '') {
        result = false;
      }
      return result;
    }

    /**
     * バリデーション：半角チェック
     *
     * @param {string} value
     * @returns {boolean}
     */
    isSingle(value) {
      let result = true;
      const alphabets = this.patterns.alphabetsPattern;
      const numbers = this.patterns.numbersPattern;
      const symbols = this.patterns.symbolsPattern;
      const pattern = new RegExp(
        '^[' + alphabets + numbers + symbols + ' 　' + ']+$'
      );

      /* 値が一致しない場合は結果をfalseに設定 */
      if (value !== '' && !value.match(pattern)) {
        result = false;
      }
      return result;
    }

    /**
     * バリデーション：郵便番号形式チェック
     *
     * @param {string} value
     * @returns {boolean}
     */
    isZip(value) {
      let result = true;
      const pattern = new RegExp('^[0-9]{3}-?[0-9]{4}$');

      /* 郵便番号形式（ハイフンは任意）に一致しない場合は結果をfalseに設定 */
      if (value !== '' && !value.match(pattern)) {
        result = false;
      }
      return result;
    }
  }

  formApp.Validation = Validation;
})();
