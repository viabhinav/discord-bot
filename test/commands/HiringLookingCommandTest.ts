import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";

// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import HiringLookingCommand from "../../src/commands/HiringLookingCommand";
import Command from "../../src/abstracts/Command";

describe("RuleCommand", () => {
	describe("constructor()", () => {
		it("creates a command called hl", () => {
			const command = new HiringLookingCommand();

			expect(command.getName()).to.equal("hl");
		});

		it("creates a command with correct description", () => {
			const command = new HiringLookingCommand();

			expect(command.getDescription()).to.equal("Get information on how to correctly format a Hiring/Looking post");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new HiringLookingCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states how to format a post", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Hiring or Looking Post Formatting");

			// The indentation on these is a mess due to the test comparing white space.
			expect(embed.description).to.equal(`
			CodeSupport offers a free to use hiring or looking section.\n
			Here you can find people to work for you and offer your services,
			as long as it fits in with the rules. If you get scammed in hiring or looking there is
			nothing we can do, however, we do ask that you let a moderator know.
		`);
			expect(embed.fields[0].name).to.equal("Example Post");
			expect(embed.fields[0].value).to.equal(`
			We recommend basing your post on the example below to reduce your risks of it getting removed.\n
			\`\`\`
[HIRING]
Full Stack Website Developer
We are looking for a developer who is willing to bring our video streaming service to life.
Pay: $20/hour
Requirements:
- Solid knowledge of HTML, CSS and JavaScript
- Knowledge of Node.js, Express and EJS.
- Able to turn Adobe XD design documents into working web pages.
- Able to stick to deadlines and work as a team.
			\`\`\`
		`);
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});