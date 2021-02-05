/*! dsr-index | DSRKafuU <amzrk2.cc> | Copyright (c) Apache 2.0 License */

/* css */
import 'normalize.css';
import './scss/index.scss';

/* ts */
import { initInfo } from './ts/info';

(async function () {
  // check domain
  const host = window.location.hostname;
  const allowHosts = ['localhost', '127.0.0.1', ...__webpack_HOST__.split(',')];
  if (!allowHosts.includes(host)) {
    document.body.textContent = 'hostname not allowed';
    return;
  }

  // check redirect
  let initRedirect: Function | null = null;
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;
  // load module if needed
  if (urlParams.has('t')) {
    const redirect = await import(/* webpackChunkName: "redirect" */ './ts/redirect');
    initRedirect = redirect.initRedirect;
  }

  // init info
  await initInfo();

  // go redirect
  if (initRedirect) {
    initRedirect(urlParams);
  }
})();