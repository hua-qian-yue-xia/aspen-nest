import { Application } from "@aspen/aspen-core"

import { AppModule } from "./app-module"

async function main() {
	const application = await new Application().create(__dirname, AppModule)
	application.listen()
}

main()
