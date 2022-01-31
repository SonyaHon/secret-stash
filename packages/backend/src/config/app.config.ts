import { Config, EnvVar, Integer, Initialize } from '@sonyahon/config';
import { hashSync } from 'bcryptjs';

@Config('APP')
export class AppConfig {
  @EnvVar('HOST')
  public host = '0.0.0.0';

  @EnvVar('PORT')
  @Integer()
  public port = 8989;

  @EnvVar('SESSION_SECRET')
  public sessionSecret = 'super-secret';

  @EnvVar('USERNAME')
  public username = 'admin';

  @EnvVar('PASSWORD')
  @Initialize((data: string) => {
    return hashSync(data, 13);
  })
  public password = 'admin';


}
