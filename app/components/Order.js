import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {
  Layout,
  Text,
  Button
} from '@ui-kitten/components';

import {NavigateIcon, CloseCircleIcon} from '../theme/icons';
import {navigateToAddress} from '../services/location';
import {
  driverPickUpOrder,
  driverDeliverOrder,
  driverRejectOrder,
  driverAcceptOrder,
} from '../actions/route';
import {myTheme} from '../theme';

export class Order extends Component {
  state = {
    pressBegin: null,
  };
  handleSubmit() {
    const orderId = this.props.order._id;
    switch (this.props.order.disposition) {
      case 'EN_ROUTE':
        return this.props.driverDeliverOrder(orderId);
      case 'ACCEPTED':
        return this.props.driverAcceptOrder(orderId);
      default:
        return this.props.driverPickUpOrder(orderId);
    }
  }

  rejectPressIn() {
    this.setState({
      pressBegin: Date.now(),
    });
  }
  rejectPressOut() {
    console.log(Date.now(), this.state.pressBegin);
    if (Date.now() > this.state.pressBegin + 3000) {
      this.props.driverRejectOrder(this.props.order._id);
    }
  }

  render() {
    const {order} = this.props;
    const {address, customer, notes, disposition} = order;
    const {firstName, lastName} = customer;
    const {street, unit, city, state, zip} = address ? address : {};
    return (
      <Layout style={styles.container} level="2">
        <Layout style={styles.customerInfo} level="3">
          <Layout style={styles.customerTitle} level="3">
            <Text category="h2">
              {firstName} {lastName[0]}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigateToAddress({street, unit, city, state, zip})
              }
              style={styles.icon}>
              <NavigateIcon color="white" />
            </TouchableOpacity>
          </Layout>

          <Text category="s2">
            {street} {unit ? '#' + unit : ''} {city}, {state} {zip}
          </Text>
          <Text>Notes:</Text>
          <ScrollView>
            <Text category="p2">
              {notes}Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Curabitur diam libero, egestas non orci nec, vehicula ullamcorper
              justo. Aliquam nulla justo, venenatis a purus vitae, congue
              accumsan urna.
            </Text>
          </ScrollView>
        </Layout>
        <Layout style={styles.orderItemList} level="3">
          <ScrollView>
            {[...order.orderItems, ...order.orderItems].map((orderItem) => (
              <Layout level="4" style={styles.orderItem}>
                <Layout level="4" style={styles.orderItemInfo}>
                  <Text category="h5">{orderItem.menuItem.name}</Text>
                </Layout>
                {orderItem.modifications.map((modification) => (
                  <Layout
                    key={modification._id}
                    level="5"
                    style={styles.modification}>
                    <Text category="p1">
                      {modification.name}:{' '}
                      {modification.options.map((option) => option.name)}
                    </Text>
                  </Layout>
                ))}
              </Layout>
            ))}
          </ScrollView>
        </Layout>
        <OrderButtons
          {...this.props}
          handleSubmit={this.handleSubmit.bind(this)}
          rejectPressIn={this.rejectPressIn.bind(this)}
          rejectPressOut={this.rejectPressOut.bind(this)}
        />
      </Layout>
    );
  }
}

const OrderButtons = (props) => {
  switch (props.order.disposition) {
    case 'ACCEPTED':
      return (
        <View style={styles.buttonGroup}>
          <Button style={styles.button} onPress={() => props.handleSubmit()}>
            Accept
          </Button>
          <Button
            style={styles.button}
            status="danger"
            accessoryLeft={CloseCircleIcon}
            onPressIn={() => props.rejectPressIn()}
            onPressOut={() => props.rejectPressOut()}>
            Reject
          </Button>
        </View>
      );
    case 'EN_ROUTE':
      return (
        <Button status="success" onPress={() => props.handleSubmit()}>
          Deliver
        </Button>
      );
    case 'READY':
      return (
        <Button status="success" onPress={() => props.handleSubmit()}>
          Pick Up
        </Button>
      );
    default:
      return null;
  }
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: windowWidth * 0.05,
    padding: 10,
    width: windowWidth * 0.9,
    borderRadius: 10,
  },
  customerInfo: {
    textAlign: 'center',
    padding: 10,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  customerTitle: {borderTopLeftRadius: 10, borderTopRightRadius: 10},
  orderItemList: {
    flex: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  orderItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  orderItemInfo: {
    flex: 2,
  },
  modification: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
    width: '100%',
  },
  option: {
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    width: '40%',
    marginHorizontal: '5%',
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  driverPickUpOrder,
  driverDeliverOrder,
  driverRejectOrder,
  driverAcceptOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
