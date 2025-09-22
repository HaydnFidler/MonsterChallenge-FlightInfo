export class AuthSession {
    
  userName: string = '';
  linkAuth: AuthEmailLinkResult = new AuthEmailLinkResult();
  passwordAuth: AuthPasswordResult = new AuthPasswordResult();

  constructor() {
    this.reset();
  }

  public reset() {
    this.userName = '';
    this.linkAuth.reset();
    this.passwordAuth.reset();
  }

  public isAuthed() {
    return (this.linkAuth.verified && this.passwordAuth.verified);
  }

  public hasLandingToken(): boolean {
    return this.linkAuth.hasLandingToken();
  }
  
  public enactLandingEvent(landingUrl: string) { this.linkAuth.enactLandingEvent(landingUrl); }
  public addTokenAuthed() { this.linkAuth.addTokenAuthed(); }
  public addUserPassedAuth(userName: string) { this.passwordAuth.addUserPassedAuth(); this.userName = userName; }
}

export class AuthEmailLinkResult {
  public landingUrl: string = '';
  public landedToken: string = '';
  public verified: boolean = false;

  public reset() {
    this.verified = false;
  }

  public enactLandingEvent(url: string) {
    if (this.setLandingUrlOnce(url)) {
      // The landing URL was set, parse the token from it and store it in the session...
      this.addTokenToSession(this.calcLandingToken());
    }
  }

  private setLandingUrlOnce(url: string): boolean {
    if (this.landingUrl == '') {
      this.landingUrl = url;
      return true;
    }

    return false;
  }

  public addTokenToSession(token: string) {
    this.landedToken = token;
  }

  public addTokenAuthed() {
    this.verified = true;
  }

  public hasLandingToken() {
    return (this.landedToken != '');
  }

  public calcLandingToken(): string {
    return this.parseTokenFromUrl(this.landingUrl);
  }

  private parseTokenFromUrl(fullUrl: string): string {
    try {
      const url = new URL(fullUrl);
      return url.searchParams.get('token') || '';
    } catch (error) {
      console.error('Error parsing landing URL:', error);
      return '';
    }
  }
}

export class AuthPasswordResult {
  public verified: boolean = false;

  public reset() {
    this.verified = false;
  }
  
  public addUserPassedAuth() {
    this.verified =  true;
  }
}
