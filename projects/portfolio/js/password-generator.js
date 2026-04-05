function secureRandomInt(maxExclusive) {
	if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
		throw new Error('maxExclusive must be a positive integer');
	}

	var uint32Max = 0xffffffff;
	var acceptableRange = uint32Max - (uint32Max % maxExclusive);
	var randomArray = new Uint32Array(1);

	while (true) {
		window.crypto.getRandomValues(randomArray);
		if (randomArray[0] < acceptableRange) {
			return randomArray[0] % maxExclusive;
		}
	}
}

function shuffleString(value) {
	var chars = value.split('');
	for (var i = chars.length - 1; i > 0; i -= 1) {
		var j = secureRandomInt(i + 1);
		var temp = chars[i];
		chars[i] = chars[j];
		chars[j] = temp;
	}
	return chars.join('');
}

function getPasswordStrength(password) {
	var score = 0;

	if (password.length >= 12) {
		score += 1;
	}
	if (password.length >= 16) {
		score += 1;
	}
	if (/[A-Z]/.test(password)) {
		score += 1;
	}
	if (/[a-z]/.test(password)) {
		score += 1;
	}
	if (/\d/.test(password)) {
		score += 1;
	}
	if (/[^A-Za-z0-9]/.test(password)) {
		score += 1;
	}

	if (score <= 2) {
		return 'Weak';
	}
	if (score <= 4) {
		return 'Medium';
	}
	return 'Strong';
}

function buildCharacterSets(options) {
	var sets = [];

	if (options.useUppercase) {
		sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	}
	if (options.useLowercase) {
		sets.push('abcdefghijklmnopqrstuvwxyz');
	}
	if (options.useDigits) {
		sets.push('0123456789');
	}
	if (options.useSpecial) {
		sets.push('!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~');
	}

	return sets;
}

function generatePassword(length, options) {
	if (length < 4) {
		throw new Error('Password length must be at least 4.');
	}

	var sets = buildCharacterSets(options);
	if (!sets.length) {
		throw new Error('Select at least one character type.');
	}

	if (length < sets.length) {
		throw new Error('Length must be at least ' + sets.length + ' for the selected options.');
	}

	var allCharacters = sets.join('');
	var passwordChars = [];

	sets.forEach(function (set) {
		passwordChars.push(set[secureRandomInt(set.length)]);
	});

	while (passwordChars.length < length) {
		passwordChars.push(allCharacters[secureRandomInt(allCharacters.length)]);
	}

	return shuffleString(passwordChars.join(''));
}

function setupPasswordGeneratorPage() {
	var lengthInput = document.getElementById('password-length');
	if (!lengthInput) {
		return;
	}

	var countInput = document.getElementById('password-count');
	var upperCheckbox = document.getElementById('opt-uppercase');
	var lowerCheckbox = document.getElementById('opt-lowercase');
	var digitsCheckbox = document.getElementById('opt-digits');
	var specialCheckbox = document.getElementById('opt-special');
	var generateSingleButton = document.getElementById('generate-single');
	var generateMultipleButton = document.getElementById('generate-multiple');
	var copyButton = document.getElementById('copy-password');
	var checkStrengthButton = document.getElementById('check-strength');
	var generatedPasswordInput = document.getElementById('generated-password');
	var generatedList = document.getElementById('generated-list');
	var strengthOutput = document.getElementById('password-strength');
	var messageOutput = document.getElementById('generator-message');
	var strengthInput = document.getElementById('strength-input');
	var strengthCheckResult = document.getElementById('strength-check-result');

	function getOptions() {
		return {
			useUppercase: upperCheckbox.checked,
			useLowercase: lowerCheckbox.checked,
			useDigits: digitsCheckbox.checked,
			useSpecial: specialCheckbox.checked
		};
	}

	function showMessage(text, isError) {
		messageOutput.textContent = text;
		messageOutput.classList.toggle('is-error', Boolean(isError));
	}

	generateSingleButton.addEventListener('click', function () {
		try {
			var length = Number(lengthInput.value || '12');
			var password = generatePassword(length, getOptions());
			generatedPasswordInput.value = password;
			strengthOutput.textContent = 'Strength: ' + getPasswordStrength(password);
			showMessage('Password generated.', false);
		} catch (error) {
			showMessage(error.message, true);
		}
	});

	generateMultipleButton.addEventListener('click', function () {
		try {
			var count = Number(countInput.value || '5');
			var length = Number(lengthInput.value || '12');

			if (count < 1 || count > 50) {
				throw new Error('Count must be between 1 and 50.');
			}

			var options = getOptions();
			var lines = [];

			for (var i = 0; i < count; i += 1) {
				var password = generatePassword(length, options);
				lines.push(String(i + 1) + '. ' + password + ' (' + getPasswordStrength(password) + ')');
			}

			generatedList.value = lines.join('\n');
			showMessage('Generated ' + count + ' passwords.', false);
		} catch (error) {
			showMessage(error.message, true);
		}
	});

	copyButton.addEventListener('click', function () {
		var value = generatedPasswordInput.value;
		if (!value) {
			showMessage('Generate a password first.', true);
			return;
		}

		navigator.clipboard.writeText(value).then(function () {
			showMessage('Password copied to clipboard.', false);
		}).catch(function () {
			showMessage('Unable to copy automatically. Please copy manually.', true);
		});
	});

	checkStrengthButton.addEventListener('click', function () {
		var value = strengthInput.value || '';
		if (!value) {
			strengthCheckResult.textContent = 'Strength: -';
			showMessage('Enter a password to check.', true);
			return;
		}

		strengthCheckResult.textContent = 'Strength: ' + getPasswordStrength(value);
		showMessage('Strength checked.', false);
	});
}

document.addEventListener('DOMContentLoaded', function () {
	setupPasswordGeneratorPage();
});
