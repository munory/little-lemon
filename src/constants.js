export const RESTAURANT = {
  name:    'Little Lemon',
  street:  '1250 N Dearborn St',
  city:    'Chicago',
  state:   'IL',
  zip:     '60610',
  phone:   '+1 (312) 555-0100',
  get fullAddress() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },
};

export const MAX_CART_QTY = 10;
