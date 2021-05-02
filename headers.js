chrome.webRequest.onHeadersReceived.addListener(function(details) {
    var headers = details.responseHeaders;
    var foundCohort = false;
    for(var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name.toLowerCase() !== 'permissions-policy' || headers[i].value.toLowerCase().indexOf('cohort') === -1) {
            continue;
        }

        const perms = headers[i].value.split(',')
        for (var perm in perms) {
            if (perm.toLowerCase().indexOf('cohort') === -1) {
                headers[i].value += perm + ', ';
                continue;
            }
            foundCohort = true;
            headers[i].value += 'interest-cohort=(), ';
        }
        if (!foundCohort) {
            console.warn("Missed header: " + headers[i]);
            headers[i].value = 'interest-cohort=()';
        }
    }

    if (!foundCohort) {
        headers.push({name: 'Permissions-Policy', value: 'interest-cohort=()' });
    }

    return {responseHeaders: headers};
}, { urls: [ "<all_urls>" ] }, ['responseHeaders', 'blocking', 'extraHeaders']);

