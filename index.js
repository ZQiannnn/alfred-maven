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
alfy.fetch('http://maven.aliyun.com/artifact/aliyunMaven/searchArtifactByGav', {
	query: query
}).then(data => {
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
			quicklookurl: url,
			arg: mvn,
			mods: {
				cmd: {
					arg: mvn,
					subtitle: `Copied as maven format.`
				},
				alt: {
					arg: gradle,
					subtitle: `Copied as gradle format.`
				}
			}

		};
	});
	alfy.output(result);
});


alfy.fetch('http://search.maven.org/solrsearch/select', {
	query: {
		q,
		start: 0,
		rows: 20
	}
}).then(data => {
	const items = data.response.docs
		.map(x => {
			const v = x.v?x.v:x.latestVersion;
			const mvn = `<dependency>\n  <groupId>${x.g}</groupId>\n  <artifactId>${x.a}</artifactId>\n  <version>${v}</version>\n</dependency>`;
			const gradle = `compile '${x.g}:${x.a}:${v}'`;
			return {
				title: `${x.g}:${x.a}:${v}`,
				subtitle: `updated at ${dateFormat('yyyy-dd-MM', new Date(x.timestamp))}`,
				arg: mvn,
				mods: {
					cmd: {
						arg: mvn,
						subtitle: `copy maven dependency to clipboard`
					},
					alt: {
						arg: gradle,
						subtitle: `copy gradle dependency to clipboard`
					}
				}
			};
		});

	alfy.output(items);
});
