interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

const mailConfig = {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      name: 'Gabriel Kim',
      email: 'gabrielkim13@gmail.com',
    },
  },
} as IMailConfig;

export default mailConfig;
