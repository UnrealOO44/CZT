

const scriptsInEvents = {

	async Help_e_Event2(runtime, localVars)
	{
		const element = document.documentElement;
		if (element.requestFullscreen) {
		    element.requestFullscreen();
		} else if (element.webkitRequestFullscreen) { /* Safari/iOS fallback syntax */
		    element.webkitRequestFullscreen();
		}
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
