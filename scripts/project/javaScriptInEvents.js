

const scriptsInEvents = {

	async Notification_ee_Event49(runtime, localVars)
	{

	},

	async Level_complete_e_Event3(runtime, localVars)
	{
		window.open("https://www.visitczechia.com/","_blank");
	},

	async Menu_ee_Event16(runtime, localVars)
	{
		window.open("https://www.visitczechia.com/","_blank");
	},

	async Javascripts_ee_Event2(runtime, localVars)
	{
		window.ga4.tutorialView()
	},

	async Javascripts_ee_Event4(runtime, localVars)
	{
		window.ga4.levelStart(runtime.globalVars.Level_Progress)
	},

	async Javascripts_ee_Event6(runtime, localVars)
	{
		window.ga4.outboundClick('side_menu'|'puzzle_success', url)
	},

	async Javascripts_ee_Event8(runtime, localVars)
	{
		window.ga4.menuOpen()
	},

	async Javascripts_ee_Event10(runtime, localVars)
	{
		window.ga4.hintOpen(runtime.globalVars.Level_Progress)
	},

	async Javascripts_ee_Event12(runtime, localVars)
	{
		window.ga4.resumeCodeView(runtime.globalVars.Level_Progress)
	},

	async Javascripts_ee_Event14(runtime, localVars)
	{
		window.ga4.gameComplete()
	},

	async Javascripts_ee_Event16(runtime, localVars)
	{
		window.ga4.newsletterSignup(runtime.globalVars.Player_Email)
	},

	async Javascripts_ee_Event18(runtime, localVars)
	{
		window.ga4.puzzleAttempt(runtime.globalVars.Level_Progress, false)
	},

	async Javascripts_ee_Event20(runtime, localVars)
	{
		window.ga4.puzzleAttempt(runtime.globalVars.Level_Progress, true)
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
