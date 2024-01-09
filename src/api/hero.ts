import { adminService } from './admin';
import {
  AddHeroRequest,
  AddHeroResponse,
  GetHeroRequest,
  GetHeroResponse,
} from './proto-http/admin';

export function addHero(request: AddHeroRequest): Promise<AddHeroResponse> {
  return adminService.AddHero(request);
}

export function getHero(request: GetHeroRequest): Promise<GetHeroResponse> {
  return adminService.GetHero(request);
}
