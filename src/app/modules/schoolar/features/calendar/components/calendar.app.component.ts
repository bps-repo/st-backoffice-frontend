import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/core/services/event.service';
// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LessonEvent } from 'src/app/core/models/lesson';
import { LESSONS_EVENTS } from 'src/app/shared/constants/lessons';

@Component({
    templateUrl: './calendar.app.component.html',
    styleUrls: ['./calendar.app.component.scss'],
})
export class CalendarAppComponent implements OnInit {
    events: LessonEvent[] = LESSONS_EVENTS;

    today: string = '';

    calendarOptions: any = {
        initialView: 'timeGridWeek',
    };

    showDialog: boolean = false;

    clickedEvent: any = null;

    dateClicked: boolean = false;

    edit: boolean = false;

    tags: any[] = [];

    view: string = '';

    changedEvent: any;

    constructor(private eventService: EventService) {}

    ngOnInit(): void {
        this.today = '2024-12-26';
        this.tags = this.events.map((item) => item.tag);

        this.calendarOptions = {
            initialView: 'timeGridWeek',
            locale: 'pt-br',
            events: this.events,
            slotMinTime: '08:00:00',
            slotMaxTime: '23:00:00',
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            height: 720,
            hiddenDays: [0],
            initialDate: this.today,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            },
            editable: false,
            selectable: false,
            selectMirror: true,
            Draggable: false,
            dayMaxEvents: false,
            eventClick: (e: MouseEvent) => this.onEventClick(e),
            select: (e: MouseEvent) => this.onDateSelect(e),
            eventContent: (args: any) => this.onEventRender(args),
            eventMouseEnter: this.handleEventMouseEnter.bind(this), // Evento para hover
            eventMouseLeave: this.handleEventMouseLeave.bind(this),
        };
    }

    handleEventMouseEnter(mouseEnterInfo: any) {
        const { title, extendedProps } = mouseEnterInfo.event;
        const tooltip = document.createElement('div');
        tooltip.id = 'event-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.top = `${mouseEnterInfo.jsEvent.pageY + 10}px`;
        tooltip.style.left = `${mouseEnterInfo.jsEvent.pageX + 10}px`;
        tooltip.style.zIndex = '1000';
        tooltip.textContent =
            mouseEnterInfo.event.extendedProps.description || 'Sem descrição';

        document.body.appendChild(tooltip);
    }

    handleEventMouseLeave() {
        const tooltip = document.getElementById('event-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    onEventRender(args: any) {
        const { title, extendedProps } = args.event;
        console.log(extendedProps);
        return {
            html: `
              <div>
                <b>${extendedProps.time}</b><br/>
                <b>${extendedProps.center}(Online)</b><br/>
                <b>${extendedProps.teacher}</b><br/>
              </div>
            `,
        };
    }

    onEventClick(e: any) {
        this.clickedEvent = e.event;
        let plainEvent = e.event.toPlainObject({
            collapseExtendedProps: true,
            collapseColor: true,
        });
        this.view = 'display';
        this.showDialog = false;

        this.changedEvent = { ...plainEvent, ...this.clickedEvent };
        this.changedEvent.start = this.clickedEvent.start;
        this.changedEvent.end = this.clickedEvent.end
            ? this.clickedEvent.end
            : this.clickedEvent.start;
    }

    onDateSelect(e: any) {
        this.view = 'new';
        this.showDialog = false;
        this.changedEvent = {
            ...e,
            title: null,
            description: null,
            location: null,
            backgroundColor: null,
            borderColor: null,
            textColor: null,
            tag: { color: null, name: null },
        };
    }

    handleSave() {
        if (!this.validate()) {
            return;
        } else {
            this.showDialog = false;
            this.clickedEvent = {
                ...this.changedEvent,
                backgroundColor: this.changedEvent.tag.color,
                borderColor: this.changedEvent.tag.color,
                textColor: '#212121',
            };

            if (this.clickedEvent.hasOwnProperty('id')) {
                this.events = this.events.map((i) =>
                    i.id!.toString() === this.clickedEvent.id.toString()
                        ? (i = this.clickedEvent)
                        : i
                );
            } else {
                this.events = [
                    ...this.events,
                    {
                        ...this.clickedEvent,
                        id: Math.floor(Math.random() * 10000),
                    },
                ];
            }
            this.calendarOptions = {
                ...this.calendarOptions,
                ...{ events: this.events },
            };
            this.clickedEvent = null;
        }
    }

    onEditClick() {
        this.view = 'edit';
    }

    delete() {
        this.events = this.events.filter(
            (i) => i.id!.toString() !== this.clickedEvent.id.toString()
        );
        this.calendarOptions = {
            ...this.calendarOptions,
            ...{ events: this.events },
        };
        this.showDialog = false;
    }

    validate() {
        let { start, end } = this.changedEvent;
        return start && end;
    }
}
