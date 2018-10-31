'use strict';
const alfy = require('alfy');

// 搜索模式
// <artifactId>
// <artifactId> <version>
// <groupId> <artifactId> <version>
// 任意一个都可以被*代替
let query = {groupId: '', artifactId: '', version: '', repoId: 'central'};
let field3 = ['groupId', 'artifactId', 'version'];
let field2 = ['artifactId', 'version'];
let field1 = ['artifactId'];
let keywords = alfy.input.split(' ');
if (keywords.length === 3) {
	keywords.forEach((v, i) => {
		if (v !== '*') {
			query[field3[i]] = v;
		}
	});
}
if (keywords.length === 2) {
	keywords.forEach((v, i) => {
		if (v !== '*') {
			query[field2[i]] = v;
		}
	});
}
if (keywords.length === 3) {
	keywords.forEach((v, i) => {
		if (v !== '*') {
			query[field3[i]] = v;
		}
	});
}
if (keywords.length === 1) {
	keywords.forEach((v, i) => {
		if (v !== '*') {
			query[field1[i]] = v;
		}
	});
}
alfy.log('query:\n' + query);
alfy.fetch('http://maven.aliyun.com/artifact/aliyunMaven/searchArtifactByGav', {
	query: query
}).then(data => {
	alfy.log('data:\n' + data);
	let result = data.object.filter(m => {
		// 过滤非jar
		return m.packaging === 'jar';
	}).slice(0, 20).map(m => {
		// 整理成alfred
		const mvn = `<dependency>\n  <groupId>${m.groupId}</groupId>\n  <artifactId>${m.artifactId}</artifactId>\n  <version>${m.version}</version>\n</dependency>`;
		const gradle = `compile '${m.groupId}:${m.artifactId}:${m.version}'`;
		const url = 'https://mvnrepository.com/artifact/${m.groupId}/${m.artifactId}/${m.version}';

		return {
			title: m.artifactId,
			subtitle: m.groupId + ':' + m.artifactId + ':' + m.version,
			autocomplete: m.artifactId,
			arg: mvn,
			mods: {
				cmd: {
					arg: gradle,
					subtitle: `Copy as gradle format.`,
					variables: {
						action: 'copy',
						title: 'Maven format was copied to your clipboard'
					}
				},
				alt: {
					arg: url,
					subtitle: `Open in mvnrepository.com .`,
					variables: {
						action: 'browser'
					}
				}
			},
			variables:{
				action: 'copy',
				title: 'Maven format was copied to your clipboard'
			}

		};
	});
	alfy.log('result:\n' + result);
	alfy.output(result);
});

