jQuery(document).ready(function () {

  let pluginUrl = SailPoint.CONTEXT_PATH + '/plugins/pluginPage.jsf?pn=advancedForwarding';
  let check = jQuery("a[href$='/identityiq/dashboard/identityPreferences.jsf']");

  if (check.length > 0) {
    check.parent().after(`<li role="presentation">
    <a href="${pluginUrl}" role="menuitem">
      <i role="presentation" aria-hidden="true" class="fa fa-wrench m-r-xms"></i>
      Advanced Forwarding
    </a>
</li>`)
  }

});