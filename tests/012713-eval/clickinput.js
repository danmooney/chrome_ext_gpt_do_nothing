(function clickInput() {    var $ = window.gptJQuery,        inputEl = $('[id=\"TERMS\"][type=\"checkbox\"][name=\"TERMS\"][onclick=\"hasExitPopOpened = true;hasExitFrameOpened = true;if(document.getElementById(\'SitePopExtender_HasTERMSWindowOpened').value == \'\'){document.getElementById('SitePopExtender_HasTERMSWindowOpened').value='True';win2=window.open(tokenReplace('https://affiliate.icclicktracker.com/rd/r.php?progid=2729&pub=302067&c1=[$AFFILIATEID$]&c2=[$PROGRAMID$]|SmartCouponSaver&c3=[$HITID$]&first=[$FIRST_NAME$]&last=[$LAST_NAME$]&email=[$EMAIL$]&address1=[$ADDRESS1$]&address2=[$ADDRESS2$]&zip=[$ZIP$]'), 'SitePopExtender_HasTERMSWindowOpened', 'fullscreen=yes,scrollbars=1,resizable=1,toolbar=1,location=1,menubar=1,status=1,directories=0');win2.blur();window.focus();};\"][data-gptparsed=\"1\"]').filter(\":visible\");     console.warn(inputElSelectorStr);     console.warn(inputEl);     inputEl.trigger(\"focus\").trigger(\"click\").attr(\"checked\",\"checked\").trigger(\"blur\");})