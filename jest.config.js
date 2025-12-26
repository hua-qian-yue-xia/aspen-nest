module.exports = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: ".",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "./coverage",
	testEnvironment: "node",
	moduleNameMapper: {
		"^apps/(.*)$": "<rootDir>/apps/$1",
		"^libs/(.*)$": "<rootDir>/libs/$1",
		"^packages/(.*)$": "<rootDir>/packages/$1",
		"^@aspen/aspen-core(|/.*)$": "<rootDir>/libs/aspen-core/src/$1",
		"^@aspen/aspen-framework(|/.*)$": "<rootDir>/libs/aspen-framework/src/$1",
		"^@aspen/aspen-gen(|/.*)$": "<rootDir>/libs/aspen-gen/src/$1",
		"^@aspen/aspen-workflow(|/.*)$": "<rootDir>/libs/aspen-workflow/src/$1",
	},
}
