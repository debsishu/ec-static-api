export class ImageProvider {
  static readonly DEFAULT_PROFILE_IMGS = [
    "https://media.tenor.com/4YDZfwNpjwAAAAAM/pogled-pas.gif",
    "https://i.pinimg.com/originals/c3/9e/8c/c39e8ca30f2388f7599c6ea3b4972485.gif",
    "https://media.tenor.com/HTaajnCm3I0AAAAM/dog-smile.gif",
    "https://i.pinimg.com/originals/69/80/86/6980866afcaea63e7dc9c21fc14cc004.gif",
  ];

  static readonly DEFAULT_COVER_IMGS = [
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWJzdHJhY3R8fHx8fHwxNjkwMDI2MDM2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1552688468-d87e6f7a58f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWJzdHJhY3R8fHx8fHwxNjkwMDI2MTQy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1573655349936-de6bed86f839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWJzdHJhY3R8fHx8fHwxNjkwMDI2MTMz&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1557264337-e8a93017fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWJzdHJhY3R8fHx8fHwxNjkwMDI2MTI1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
  ];

  static readonly DEFAULT_CLUB_COVER_IMGS = [
    "https://images.unsplash.com/photo-1689309059309-f7ade47910ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
    "https://images.unsplash.com/photo-1689005046927-0aa9f398247a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1670509077602-d9fb46a03172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "https://images.unsplash.com/photo-1677611998429-1baa4371456b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "https://images.unsplash.com/photo-1687042277586-971369d3d241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  ];

  static readonly DEFAULT_CLUB_PROFILE_IMGS = [
    "https://images.unsplash.com/photo-1689604926022-747e73d6d021?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1635079959001-69736953f90f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "https://images.unsplash.com/photo-1653699723691-ba91de1e4de9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    "https://images.unsplash.com/photo-1643483698547-6f6359386f9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1641278789193-5023dd515dc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
  ];

  static getProfilePicture = (): string => {
    const randomIndex = Math.floor(
      Math.random() * this.DEFAULT_PROFILE_IMGS.length
    );
    return this.DEFAULT_PROFILE_IMGS[randomIndex];
  };

  static getProfileCoverPicture = (): string => {
    const randomIndex = Math.floor(
      Math.random() * this.DEFAULT_COVER_IMGS.length
    );
    return this.DEFAULT_COVER_IMGS[randomIndex];
  };

  static getClubBannerPicture = (): string => {
    const randomIndex = Math.floor(
      Math.random() * this.DEFAULT_CLUB_COVER_IMGS.length
    );
    return this.DEFAULT_CLUB_COVER_IMGS[randomIndex];
  };

  static getClubProfilePicture = (): string => {
    const randomIndex = Math.floor(
      Math.random() * this.DEFAULT_CLUB_PROFILE_IMGS.length
    );
    return this.DEFAULT_CLUB_PROFILE_IMGS[randomIndex];
  };
}
