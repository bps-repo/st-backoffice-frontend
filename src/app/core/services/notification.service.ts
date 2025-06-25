import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from './interfaces/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Gets all notifications.
   * @returns An observable containing an array of Notification objects.
   */
  getNotifications(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets a notification by ID.
   * @param id The ID of the notification.
   * @returns An observable containing the Notification object.
   */
  getNotificationById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Creates a new notification.
   * @param notificationData The notification data to create.
   * @returns An observable containing the created Notification object.
   */
  createNotification(notificationData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, notificationData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets notifications for a user.
   * @param userId The ID of the user.
   * @returns An observable containing an array of Notification objects.
   */
  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/user/${userId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets notifications for a user by read status.
   * @param userId The ID of the user.
   * @param isRead The read status to filter by.
   * @returns An observable containing an array of Notification objects.
   */
  getUserNotificationsByReadStatus(userId: string, isRead: boolean): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/user/${userId}/read/${isRead}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets notifications by type.
   * @param type The type to filter by.
   * @returns An observable containing an array of Notification objects.
   */
  getNotificationsByType(type: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-type/${type}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets notifications by date range.
   * @param startDate The start date.
   * @param endDate The end date.
   * @returns An observable containing an array of Notification objects.
   */
  getNotificationsByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-date-range/${startDate}/${endDate}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Marks a notification as read.
   * @param id The ID of the notification.
   * @returns An observable containing the updated Notification object.
   */
  markNotificationAsRead(id: string): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Marks all notifications for a user as read.
   * @param userId The ID of the user.
   * @returns An observable containing the response.
   */
  markAllNotificationsAsRead(userId: string): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/user/${userId}/read-all`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Updates a notification.
   * @param id The ID of the notification.
   * @param notificationData The updated notification data.
   * @returns An observable containing the updated Notification object.
   */
  updateNotification(id: string, notificationData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, notificationData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes a notification.
   * @param id The ID of the notification to delete.
   * @returns An observable containing the response.
   */
  deleteNotification(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes all notifications for a user.
   * @param userId The ID of the user.
   * @returns An observable containing the response.
   */
  deleteAllUserNotifications(userId: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/user/${userId}/delete-all`).pipe(
      map((response) => response.data)
    );
  }
}
