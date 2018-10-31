import test from 'ava';
import alfyTest from 'alfy-test';

test(async () => {
	const alfy = alfyTest();
	const result = await alfy('fastjson');
	console.log(result);
});
