/**
 * index.js
 * @fileoverview ページ処理を起動
 */

/**
 * formApp
 * @namespace
 */
var formApp = formApp || {};

/**
 * 郵便番号検索フォームの処理を起動
 */
(function () {
  const formId = 'zip-search';
  const zipId = 'zip';
  const resultId = 'result';
  const templateId = 'addressTemplate';
  const url = 'https://zipcloud.ibsnet.co.jp/api/search';
  const formModel = {
    zip: {
      label: '郵便番号',
      rules: ['notBlank', 'isSingle', 'isZip'],
      filters: ['trim'],
    },
  };
  /* バリデーションを起動 */
  const validation = new formApp.Validation(formId, formModel);
  validation.initialize();

  /* 住所検索を起動 */
  const zipSearch = new formApp.ZipSearch(
    formId,
    zipId,
    resultId,
    templateId,
    url
  );
  zipSearch.initialize();
})();

/**
 * MDC-Web コンポーネント設定
 */
(function () {
  mdc.textField.MDCTextField.attachTo(
    document.querySelector('.mdc-text-field')
  );
})();
