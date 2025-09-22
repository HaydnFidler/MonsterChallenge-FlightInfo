// The DevelopmentFlags class allows temporary flow controls to help reach components that would otherwise be protected by the normal flow.
export class DevelopmentFlags {
public enableTokenWall: boolean =  false; // Must be "true' in production. Can be "false" during develpment to see components that would otherwise be protected.
  public enableAuthWall: boolean =  false;  // Must be "true" in production. Can be "false" during develpment to see components that would otherwise be protected.
  public showTestDataFillButton: boolean =  true;  // Must be "false" in production. Can be "true" during development to fill form data quickly.
  public supplyExampleToken: boolean = true;  
  private exampleUrl: string = 'http://127.0.0.1:9002/verify?token=MTc1ODEzNTA5Njovdle2_JZvDJTxeRYANZO10tDaijAC4dvDCYO8EqWHCQ'; // This token matches the email address: "haydn@haydnfidler.com" and psasword: "haydnhaydn".
  public supplyProxyTokenWebApiUrl: boolean = true; // Must be "false" in production, or rather when this web app is hosted. Use "true" when running in localhost. This is necessary to avoid a CORS error while running locally.
  private proxyTokenWebApiUrl: string = '';
  private hostedTokenWebApiUrl: string = 'https://studio--studio-9761992685-e3ea1.us-central1.hosted.app';

  constructor(productionMode: boolean = true) {
    if (productionMode) { 
      this.forceProductionMode(); 
    }
  }

  public getRuntimeLandingUrl(): string {
    return (this.supplyExampleToken ? this.exampleUrl : window.location.href);
  }

  public getTokenWebApiUrl(): string {
    return (this.supplyProxyTokenWebApiUrl ? this.proxyTokenWebApiUrl : this.hostedTokenWebApiUrl);
  }

  public get isProductionMode(): boolean {
    return (this.enableAuthWall && this.enableTokenWall && !this.showTestDataFillButton && !this.supplyExampleToken && !this.supplyProxyTokenWebApiUrl);
  }

  private forceProductionMode() {
    this.enableTokenWall = true;
    this.enableAuthWall = true;
    this.showTestDataFillButton = false;
    this.supplyExampleToken = false;
    this.supplyProxyTokenWebApiUrl = false;
  }
}
