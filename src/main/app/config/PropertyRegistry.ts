/*eslint-disable*/

export default class PropertyRegistry{

  private static PROPERTY_REGISTRY: Map<String, any> = new Map<String, object>();

  public static setItem(key: string, value: any): void {
     this.PROPERTY_REGISTRY.set(key, value);
  }

  public static getItem(key: string): object{
    return this.PROPERTY_REGISTRY.get(key);
  }
}