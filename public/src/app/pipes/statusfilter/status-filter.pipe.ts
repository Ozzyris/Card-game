import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'status_filter'
})

export class StatusFilterPipe implements PipeTransform {
	transform(items: any): any {
		if (!items) {
			return [];
		}

		return items.filter(item => item);
	}
}
