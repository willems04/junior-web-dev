function buildQrUrl(wallet, coin) {
	var payload = coin + ':' + wallet;
	var base = 'https://api.qrserver.com/v1/create-qr-code/';
	return base + '?size=280x280&data=' + encodeURIComponent(payload) + '&t=' + Date.now();
}

function setQrStatus(img, message) {
	var wrapper = img.closest('.wallet-qr-wrap');
	if (!wrapper) {
		return;
	}

	var status = wrapper.querySelector('.qr-status');
	if (status) {
		status.textContent = message;
	}
}

function loadQrImage(img, isRetry) {
	var wallet = img.getAttribute('data-wallet');
	var coin = img.getAttribute('data-coin');

	if (!wallet || !coin) {
		return;
	}

	if (!isRetry) {
		img.setAttribute('data-retry-count', '0');
		setQrStatus(img, 'Loading QR code...');
	}

	img.src = buildQrUrl(wallet, coin);
}

function setupWalletQrs() {
	var qrImages = document.querySelectorAll('.wallet-qr');

	if (!qrImages.length) {
		return;
	}

	qrImages.forEach(function (img) {
		img.addEventListener('load', function () {
			img.setAttribute('data-retry-count', '0');
			setQrStatus(img, 'Scan to copy wallet details into your wallet app.');
		});

		img.addEventListener('error', function () {
			var retryCount = Number(img.getAttribute('data-retry-count') || '0') + 1;
			img.setAttribute('data-retry-count', String(retryCount));

			var delayMs = Math.min(10000 * retryCount, 60000);
			setQrStatus(img, 'QR failed to load. Retrying in ' + Math.round(delayMs / 1000) + 's...');

			window.setTimeout(function () {
				loadQrImage(img, true);
			}, delayMs);
		});

		loadQrImage(img, false);
	});

	// Refresh occasionally so users returning to the tab still get a fresh QR image.
	window.setInterval(function () {
		qrImages.forEach(function (img) {
			loadQrImage(img, true);
		});
	}, 6 * 60 * 60 * 1000);
}

function setupSendEmailButton() {
	var sendEmailButton = document.getElementById('send-email-btn');
	if (!sendEmailButton) {
		return;
	}

	var recipient = sendEmailButton.getAttribute('data-mailto') || 'willemsamplonius@outlook.com';
	var subject = sendEmailButton.getAttribute('data-subject') || 'Portfolio Contact';

	sendEmailButton.addEventListener('click', function () {
		window.location.href = 'mailto:' + encodeURIComponent(recipient) + '?subject=' + encodeURIComponent(subject);
	});
}

document.addEventListener('DOMContentLoaded', function () {
	setupWalletQrs();
	setupSendEmailButton();
});
