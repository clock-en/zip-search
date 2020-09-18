/**
 * zip-search.js
 * @fileoverview 住所検索クラスを管理
 */

/**
 * formApp
 * @namespace
 */
var formApp = formApp || {};

(function () {
  'use strict';

  /**
   * @class 郵便番号検索クラス
   * @memberOf formApp
   */
  class ZipSearch {
    constructor(formId, zipId, resultId, templateId, url) {
      this.form = document.getElementById(formId);
      this.zipId = zipId;
      this.result = document.getElementById(resultId);
      this.template = document.getElementById(templateId);
      this.url = url;
      this.callback = 'getJson';
      this.messages = {
        error: '情報の取得に失敗しました。',
        empty: '該当する住所が見つかりませんでした。',
      };
    }

    /**
     * 検索アプリの初期化を実行
     *
     * @returns {void}
     */
    initialize() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        let zip = document.getElementById(this.zipId).value;
        zip = encodeURIComponent(zip);
        this.fetchJsonP(
          `${this.url}?zipcode=${zip}&callback=${this.callback}&limit=100`
        );
        window[this.callback] = (data) => {
          this.renderHtml(data);
        };
      });
    }

    /**
     * JSONの取得
     *
     * @param {string} url
     * @returns {Object}
     */
    async fetchJson(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    /**
     * JSONP形式での取得
     *
     * @param {string} url
     * @returns {Object}
     */
    fetchJsonP(url) {
      let tag = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      tag.type = 'text/javascript';
      tag.src = url;
      head.appendChild(tag);
    }

    /**
     * 情報の描画
     *
     * @param {object} data
     * @returns {void}
     */
    renderHtml(data) {
      /* 情報を削除 */
      while (this.result.firstChild) {
        this.result.removeChild(this.result.firstChild);
      }
      /* メッセージデータが返却された場合 */
      if (data.message !== null) {
        this.result.innerHTML = `<div class="form-error-message">${data.message}</div>`;
        return;
      }
      /* 情報件数が0件の場合 */
      if (!data.results || data.results.length === 0) {
        this.result.innerHTML = `<div class="form-error-message">${this.messages.empty}</div>`;
        return;
      }

      /* HTMLソースコードを生成して出力 */
      const compile = _.template(this.template.innerHTML);
      this.result.innerHTML = compile(data);
    }
  }

  formApp.ZipSearch = ZipSearch;
})();
